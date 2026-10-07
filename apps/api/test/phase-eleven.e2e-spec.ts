import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { hashPassword } from '../src/admin-auth/password.js';
import { configureHttpApplication } from '../src/http/configure-http.js';

describe('Phase 11 admin backoffice (e2e)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  const suffix = randomUUID().slice(0, 8);
  const password = 'phase-11-strong-password';
  const emails = {
    admin: `admin-${suffix}@example.invalid`,
    host: `host-${suffix}@example.invalid`,
    editor: `editor-${suffix}@example.invalid`,
  };
  const userIds: string[] = [];
  const reservationIds: string[] = [];

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const credential = await hashPassword(password);
    for (const [name, email, role] of [
      ['Admin', emails.admin, 'ADMIN'],
      ['Host', emails.host, 'HOST'],
      ['Editor', emails.editor, 'CONTENT_EDITOR'],
    ] as const) {
      const result = await pool.query<{ id: string }>(
        `INSERT INTO admin_users (email, display_name, role, password_hash, password_salt)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [email, name, role, credential.hash, credential.salt],
      );
      userIds.push(result.rows[0]!.id);
    }
    const fixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = fixture.createNestApplication();
    configureHttpApplication(app);
    await app.init();
  });

  async function login(email: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email, password })
      .expect(201);
    return response.body.data.sessionToken as string;
  }

  async function reservation(status = 'CONFIRMED'): Promise<string> {
    const customer = await pool.query<{ id: string }>(
      `INSERT INTO customers (name,email,phone) VALUES ('Phase 11 Guest',$1,'+84900000000') RETURNING id`,
      [`guest-${randomUUID()}@example.invalid`],
    );
    const result = await pool.query<{ id: string }>(
      `INSERT INTO reservations (reservation_code,customer_id,reservation_date,start_time,guest_count,status)
       VALUES ($1,$2,CURRENT_DATE + 1,'18:00',2,$3) RETURNING id`,
      [
        `EO-${randomUUID().slice(0, 8).toUpperCase()}`,
        customer.rows[0]!.id,
        status,
      ],
    );
    reservationIds.push(result.rows[0]!.id);
    return result.rows[0]!.id;
  }

  it('logs in with an opaque stored session and revokes logout', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: emails.admin, password: 'wrong-password-value' })
      .expect(401);
    const token = await login(emails.admin);
    const stored = await pool.query<{ token_hash: string }>(
      'SELECT token_hash FROM admin_sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1',
      [userIds[0]],
    );
    expect(stored.rows[0]!.token_hash).not.toBe(token);
    await request(app.getHttpServer())
      .get('/api/v1/admin/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/v1/admin/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/v1/admin/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('enforces role boundaries on reservation PII', async () => {
    await reservation();
    const editor = await login(emails.editor);
    const host = await login(emails.host);
    await request(app.getHttpServer())
      .get('/api/v1/admin/reservations')
      .set('Authorization', `Bearer ${editor}`)
      .expect(403);
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/reservations?limit=50')
      .set('Authorization', `Bearer ${host}`)
      .expect(200);
    expect(
      response.body.data.items.some(
        (item: { guestName: string }) => item.guestName === 'Phase 11 Guest',
      ),
    ).toBe(true);
  });

  it('serializes concurrent transitions and writes immutable audit', async () => {
    const id = await reservation();
    const host = await login(emails.host);
    const call = (toStatus: string, reason?: string) =>
      request(app.getHttpServer())
        .post(`/api/v1/admin/reservations/${id}/status`)
        .set('Authorization', `Bearer ${host}`)
        .send({ expectedStatus: 'CONFIRMED', toStatus, reason });
    const responses = await Promise.all([
      call('SEATED'),
      call('CANCELLED', 'Guest requested cancellation'),
    ]);
    expect(responses.map((response) => response.status).sort()).toEqual([
      201, 409,
    ]);
    const events = await pool.query(
      'SELECT id FROM reservation_status_events WHERE reservation_id=$1',
      [id],
    );
    expect(events.rowCount).toBe(1);
  });

  it('cancels with a reason, timestamp, audit event and capacity release', async () => {
    const id = await reservation();
    const host = await login(emails.host);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/reservations/${id}/status`)
      .set('Authorization', `Bearer ${host}`)
      .send({
        expectedStatus: 'CONFIRMED',
        toStatus: 'CANCELLED',
        reason: 'Guest requested cancellation',
      })
      .expect(201);
    const row = await pool.query<{
      status: string;
      cancelled_at: Date | null;
      consumes_capacity: boolean;
      reason: string;
    }>(
      `SELECT r.status, r.cancelled_at,
              r.status = ANY(ARRAY['PENDING','CONFIRMED','SEATED']) AS consumes_capacity,
              e.reason
       FROM reservations r JOIN reservation_status_events e ON e.reservation_id=r.id
       WHERE r.id=$1`,
      [id],
    );
    expect(row.rows[0]).toMatchObject({
      status: 'CANCELLED',
      consumes_capacity: false,
      reason: 'Guest requested cancellation',
    });
    expect(row.rows[0]!.cancelled_at).toBeInstanceOf(Date);
  });

  afterAll(async () => {
    await pool.query(
      'DELETE FROM reservation_status_events WHERE reservation_id = ANY($1::uuid[])',
      [reservationIds],
    );
    await pool.query('DELETE FROM reservations WHERE id = ANY($1::uuid[])', [
      reservationIds,
    ]);
    await pool.query(
      "DELETE FROM customers WHERE email LIKE 'guest-%@example.invalid'",
    );
    await pool.query('DELETE FROM admin_users WHERE id = ANY($1::uuid[])', [
      userIds,
    ]);
    await pool.end();
    await app.close();
  });
});
