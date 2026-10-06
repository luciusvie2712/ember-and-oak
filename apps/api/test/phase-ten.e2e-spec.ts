import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { vi } from 'vitest';

import { AppModule } from '../src/app.module.js';
import { ContentService } from '../src/content/content.service.js';
import { configureHttpApplication } from '../src/http/configure-http.js';
import { OperationsService } from '../src/operations/operations.service.js';
import { PrivateEventRepository } from '../src/private-event/private-event.repository.js';

const adminKey = 'phase10_integration_content_key_123456';
const enquiryEmail = 'phase10-integration@example.invalid';
const concurrentEmail = 'phase10-concurrent@example.invalid';
const diningSlug = 'phase10-integration-private-dining';
const operationsSlug = 'phase10-integration-operations';
const closureReason = 'phase10-integration-internal-reason';

function futureTuesday(): string {
  const date = new Date(Date.now() + 7 * 86_400_000);
  while (date.getUTCDay() !== 2) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

describe('Phase 10 public content and enquiry (e2e)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  const keys: string[] = [];

  beforeAll(async () => {
    process.env.ADMIN_CONTENT_API_KEY = adminKey;
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    configureHttpApplication(app);
    await app.init();
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  });

  it('keeps Private Dining draft private, resolves media, and hides archive', async () => {
    const live = await request(app.getHttpServer())
      .get('/api/v1/content/private-dining/private-dining')
      .expect(200);
    expect(live.body.data.experiences).toHaveLength(3);
    const draft = structuredClone(live.body.data);
    draft.page.id = diningSlug;
    draft.page.slug = diningSlug;

    await request(app.getHttpServer())
      .put(`/api/v1/admin/content/private-dining/${diningSlug}/draft`)
      .set('x-content-api-key', adminKey)
      .send(draft)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/api/v1/content/private-dining/${diningSlug}`)
      .expect(404);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/private-dining/${diningSlug}/publish`)
      .set('x-content-api-key', adminKey)
      .expect(201);
    const published = await request(app.getHttpServer())
      .get(`/api/v1/content/private-dining/${diningSlug}`)
      .expect(200);
    expect(published.body.data.heroMedia.id).toBe(draft.page.heroMediaId);
    expect(
      published.body.data.experiences.map(
        (entry: { experience: { capacityLabel: string } }) =>
          entry.experience.capacityLabel,
      ),
    ).toEqual(['12–20 guests', '6–8 guests', 'Up to 80 guests']);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/private-dining/${diningSlug}/archive`)
      .set('x-content-api-key', adminKey)
      .expect(201);
    await request(app.getHttpServer())
      .get(`/api/v1/content/private-dining/${diningSlug}`)
      .expect(404);
  });

  it('composes canonical hours and public closure without internal reason', async () => {
    const date = futureTuesday();
    const editorial = {
      slug: operationsSlug,
      location: {
        name: 'Ember & Oak fixture',
        addressLine1: 'Integration fixture only',
        city: 'Ho Chi Minh City',
        countryCode: 'VN',
        timezone: 'Asia/Ho_Chi_Minh',
      },
      contact: {
        email: 'fixture@example.invalid',
        phoneDisplay: '+84 90 000 0000',
        phoneE164: '+84900000000',
      },
      policies: [
        {
          type: 'DRESS_CODE',
          title: 'Draft',
          body: 'Not public',
          publishState: 'DRAFT',
        },
      ],
      publishState: 'PUBLISHED',
    };
    await request(app.getHttpServer())
      .put(`/api/v1/admin/content/operations/${operationsSlug}/draft`)
      .set('x-content-api-key', adminKey)
      .send(editorial)
      .expect(200);
    expect(
      await app.get(ContentService).getOperations(operationsSlug),
    ).toBeNull();
    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/operations/${operationsSlug}/publish`)
      .set('x-content-api-key', adminKey)
      .expect(201);
    await pool.query(
      `INSERT INTO special_closures
        (closure_date, closure_type, reason, public_message, is_active)
       VALUES ($1, 'FULL_DAY', $2, 'Closed for a private event.', true)`,
      [date, closureReason],
    );
    const operations = await app
      .get(OperationsService)
      .getPublic(operationsSlug);
    expect(operations.contact.email).toBe('fixture@example.invalid');
    expect(operations.policies).toEqual([]);
    expect(operations.openingHours).toHaveLength(7);
    expect(operations.specialClosures).toContainEqual({
      date,
      type: 'FULL_DAY',
      publicMessage: 'Closed for a private event.',
    });
    expect(JSON.stringify(operations)).not.toContain(closureReason);
    const hours = await pool.query(
      'SELECT day_of_week FROM opening_hours ORDER BY day_of_week',
    );
    expect(operations.openingHours.map((row) => row.dayOfWeek)).toEqual(
      hours.rows.map((row) => row.day_of_week),
    );
    const availability = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${date}&guests=2`)
      .expect(200);
    expect(availability.body.data.status).toBe('SPECIAL_CLOSURE');
  });

  it('persists one enquiry across replay and rejects changed payload', async () => {
    const key = randomUUID();
    keys.push(key);
    const body = {
      name: 'Phase Ten Test',
      email: enquiryEmail,
      phone: '+84900000000',
      eventDate: '2026-12-20',
      guests: 18,
      eventType: 'Team dinner',
      budget: 'To discuss',
      message: 'Integration fixture',
    };
    const send = (payload: typeof body) =>
      request(app.getHttpServer())
        .post('/api/v1/private-event-enquiries')
        .set('Idempotency-Key', key)
        .send(payload);
    const first = await send(body).expect(201);
    expect(first.body.data).toEqual({
      id: expect.any(String),
      receivedAt: expect.any(String),
    });
    expect(JSON.stringify(first.body)).not.toContain(enquiryEmail);
    const replay = await send(body).expect(201);
    expect(replay.body.data).toEqual(first.body.data);
    const conflict = await send({ ...body, guests: 19 }).expect(409);
    expect(conflict.body.error.code).toBe('IDEMPOTENCY_CONFLICT');
    const count = await pool.query<{ count: string }>(
      'SELECT count(*) FROM private_event_enquiries WHERE email = $1',
      [enquiryEmail],
    );
    expect(Number(count.rows[0]?.count)).toBe(1);
  });

  it('rejects invalid email, phone, date, and guest count', async () => {
    const valid = {
      name: 'Phase Ten Test',
      email: enquiryEmail,
      phone: '+84900000000',
      eventDate: '2026-12-20',
      guests: 18,
      eventType: 'Team dinner',
    };
    for (const body of [
      { ...valid, email: 'bad' },
      { ...valid, phone: 'bad' },
      { ...valid, eventDate: '2026-02-30' },
      { ...valid, guests: 0 },
    ]) {
      await request(app.getHttpServer())
        .post('/api/v1/private-event-enquiries')
        .set('Idempotency-Key', randomUUID())
        .send(body)
        .expect(400);
    }
  });

  it('serializes concurrent duplicate submits into one enquiry', async () => {
    const key = randomUUID();
    keys.push(key);
    const body = {
      name: 'Concurrent Fixture',
      email: concurrentEmail,
      phone: '+84900000000',
      eventDate: '2026-12-20',
      guests: 18,
      eventType: 'Team dinner',
    };
    const send = () =>
      request(app.getHttpServer())
        .post('/api/v1/private-event-enquiries')
        .set('Idempotency-Key', key)
        .send(body);
    const [first, second] = await Promise.all([send(), send()]);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(first.body.data).toEqual(second.body.data);
    const count = await pool.query<{ count: string }>(
      'SELECT count(*) FROM private_event_enquiries WHERE email = $1',
      [concurrentEmail],
    );
    expect(Number(count.rows[0]?.count)).toBe(1);
  });

  it('rolls back the idempotency record when persistence fails', async () => {
    const key = randomUUID();
    const repository = app.get(PrivateEventRepository);
    const failure = vi
      .spyOn(repository, 'create')
      .mockRejectedValueOnce(new Error('fixture database failure'));
    try {
      const response = await request(app.getHttpServer())
        .post('/api/v1/private-event-enquiries')
        .set('Idempotency-Key', key)
        .send({
          name: 'Rollback Fixture',
          email: 'phase10-rollback@example.invalid',
          phone: '+84900000000',
          eventDate: '2026-12-20',
          guests: 18,
          eventType: 'Team dinner',
        })
        .expect(500);
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
      const record = await pool.query(
        'SELECT idempotency_key FROM private_event_enquiry_idempotency WHERE idempotency_key = $1',
        [key],
      );
      expect(record.rowCount).toBe(0);
    } finally {
      failure.mockRestore();
    }
  });

  afterAll(async () => {
    await pool.query(
      'DELETE FROM private_event_enquiry_idempotency WHERE idempotency_key = ANY($1)',
      [keys],
    );
    await pool.query(
      'DELETE FROM private_event_enquiries WHERE email = ANY($1)',
      [[enquiryEmail, concurrentEmail]],
    );
    await pool.query('DELETE FROM special_closures WHERE reason = $1', [
      closureReason,
    ]);
    await pool.query(
      "DELETE FROM content_publish_outbox WHERE document_type = 'private-dining' AND document_slug = $1",
      [diningSlug],
    );
    await pool.query(
      "DELETE FROM content_documents WHERE document_type = 'private-dining' AND slug = $1",
      [diningSlug],
    );
    await pool.query(
      "DELETE FROM content_publish_outbox WHERE document_type = 'operations' AND document_slug = $1",
      [operationsSlug],
    );
    await pool.query(
      "DELETE FROM content_documents WHERE document_type = 'operations' AND slug = $1",
      [operationsSlug],
    );
    await pool.end();
    await app.close();
  });
});
