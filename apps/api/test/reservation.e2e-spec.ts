import 'dotenv/config';

import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { ContentDatabaseService } from '../src/database/content-database.service.js';
import { configureHttpApplication } from '../src/http/configure-http.js';
import { ReservationRepository } from '../src/reservation/reservation.repository.js';

function futureDateForDay(dayOfWeek: number, minimumDays = 7): string {
  const localToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const date = new Date(`${localToday}T00:00:00Z`);
  let days = minimumDays;
  while ((date.getUTCDay() + days) % 7 !== dayOfWeek) days += 1;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('Phase 8 reservation lifecycle (e2e)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  let database: ContentDatabaseService;
  let reservations: ReservationRepository;
  let previousCapacities: Array<{
    day_of_week: number;
    capacity: number;
    is_active: boolean;
  }>;
  const date = futureDateForDay(2);
  const emailPrefix = 'phase8-integration-';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureHttpApplication(app);
    await app.init();
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    database = app.get(ContentDatabaseService);
    reservations = app.get(ReservationRepository);
    previousCapacities = (
      await pool.query<{
        day_of_week: number;
        capacity: number;
        is_active: boolean;
      }>(
        `SELECT day_of_week, capacity, is_active
         FROM service_capacities WHERE day_of_week IN (2, 3, 4, 5)`,
      )
    ).rows;
    await pool.query(
      `INSERT INTO service_capacities (day_of_week, capacity, is_active)
       VALUES (2, 4, true)
       ON CONFLICT (day_of_week) DO UPDATE
       SET capacity = EXCLUDED.capacity, is_active = true, updated_at = now()`,
    );
  });

  it('searches availability and creates a confirmed reservation', async () => {
    const availability = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${date}&guests=3`)
      .expect(200);
    expect(availability.body.data.status).toBe('AVAILABLE');

    const response = await createRequest('happy-path-key', '17:30', 3).expect(
      201,
    );
    expect(response.body.data).toMatchObject({
      idempotentReplay: false,
      reservation: {
        date,
        startTime: '17:30',
        guestCount: 3,
        status: 'CONFIRMED',
      },
    });
    expect(response.body.data.reservation.reservationCode).toMatch(/^EO-/);
  });

  it('replays the same request and rejects a changed idempotent request', async () => {
    const first = await createRequest('replay-key', '20:00', 1).expect(201);
    const replay = await createRequest('replay-key', '20:00', 1).expect(201);
    expect(replay.body.data.idempotentReplay).toBe(true);
    expect(replay.body.data.reservation.id).toBe(
      first.body.data.reservation.id,
    );

    const conflict = await createRequest('replay-key', '20:00', 2).expect(409);
    expect(conflict.body.error.code).toBe('IDEMPOTENCY_CONFLICT');
  });

  it('serializes competing requests so capacity cannot be exceeded', async () => {
    const competingDate = futureDateForDay(3);
    await pool.query(
      `INSERT INTO service_capacities (day_of_week, capacity, is_active)
       VALUES (3, 4, true)
       ON CONFLICT (day_of_week) DO UPDATE
       SET capacity = EXCLUDED.capacity, is_active = true, updated_at = now()`,
    );
    const [left, right] = await Promise.all([
      createRequest('race-left-key', '18:00', 3, competingDate),
      createRequest('race-right-key', '18:00', 3, competingDate),
    ]);
    expect([left.status, right.status].sort()).toEqual([201, 409]);

    const covers = await pool.query<{ covers: string }>(
      `SELECT COALESCE(sum(guest_count), 0)::text AS covers
       FROM reservations
       WHERE reservation_date = $1 AND start_time = '18:00'
         AND status IN ('PENDING', 'CONFIRMED', 'SEATED')`,
      [competingDate],
    );
    expect(Number(covers.rows[0]?.covers)).toBeLessThanOrEqual(4);
  });

  it('does not create customer state when validation fails', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/reservations')
      .set('Idempotency-Key', 'rollback-validation-key')
      .send({
        date,
        startTime: '19:00',
        guestCount: 2,
        guest: {
          name: 'Rollback Guest',
          email: `${emailPrefix}rollback@example.invalid`,
          phone: '+84900000000',
        },
        specialRequest: 'x'.repeat(1001),
      })
      .expect(400);
    const customers = await pool.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM customers WHERE email = $1`,
      [`${emailPrefix}rollback@example.invalid`],
    );
    expect(customers.rows[0]?.count).toBe('0');
  });

  it('rolls back the customer when reservation persistence fails', async () => {
    const email = `${emailPrefix}transaction-rollback@example.invalid`;
    await expect(
      database.transaction((client) =>
        reservations.create(
          {
            date,
            startTime: '19:00',
            guestCount: 0,
            guest: { name: 'Rollback', email, phone: '+84900000000' },
          },
          'EO-ROLLBK',
          client,
        ),
      ),
    ).rejects.toBeDefined();
    const customers = await pool.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM customers WHERE email = $1`,
      [email],
    );
    expect(customers.rows[0]?.count).toBe('0');
  });

  it('lets cancelled reservations release capacity', async () => {
    const thursday = futureDateForDay(4);
    await pool.query(
      `INSERT INTO service_capacities (day_of_week, capacity, is_active)
       VALUES (4, 4, true)
       ON CONFLICT (day_of_week) DO UPDATE
       SET capacity = EXCLUDED.capacity, is_active = true, updated_at = now()`,
    );
    const customer = await pool.query<{ id: string }>(
      `INSERT INTO customers (name, email, phone)
       VALUES ('Cancelled Fixture', $1, '+84900000000') RETURNING id`,
      [`${emailPrefix}cancelled@example.invalid`],
    );
    await pool.query(
      `INSERT INTO reservations
         (reservation_code, customer_id, reservation_date, start_time,
          guest_count, status)
       VALUES ('EO-CANCEL', $1, $2, '18:00', 4, 'CANCELLED')`,
      [customer.rows[0]?.id, thursday],
    );
    const response = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${thursday}&guests=4`)
      .expect(200);
    expect(
      response.body.data.slots.find(
        (slot: { startTime: string }) => slot.startTime === '18:00',
      ),
    ).toMatchObject({ available: true, remainingCapacity: 4 });
  });

  it('applies weekly closure and full/partial special closures', async () => {
    const monday = futureDateForDay(1);
    const closed = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${monday}&guests=2`)
      .expect(200);
    expect(closed.body.data).toMatchObject({ status: 'CLOSED', slots: [] });

    const friday = futureDateForDay(5);
    await pool.query(
      `INSERT INTO service_capacities (day_of_week, capacity, is_active)
       VALUES (5, 8, true)
       ON CONFLICT (day_of_week) DO UPDATE
       SET capacity = EXCLUDED.capacity, is_active = true, updated_at = now()`,
    );
    await pool.query(
      `INSERT INTO special_closures
         (closure_date, closure_type, reason, is_active)
       VALUES ($1, 'FULL_DAY', 'phase8-integration-full', true)`,
      [friday],
    );
    const fullDay = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${friday}&guests=2`)
      .expect(200);
    expect(fullDay.body.data.status).toBe('SPECIAL_CLOSURE');

    await pool.query(
      `DELETE FROM special_closures WHERE reason = 'phase8-integration-full'`,
    );
    await pool.query(
      `INSERT INTO special_closures
         (closure_date, closure_type, start_time, end_time, reason, is_active)
       VALUES ($1, 'PARTIAL_DAY', '18:00', '19:00',
               'phase8-integration-partial', true)`,
      [friday],
    );
    const partial = await request(app.getHttpServer())
      .get(`/api/v1/reservations/availability?date=${friday}&guests=2`)
      .expect(200);
    expect(
      partial.body.data.slots.some(
        (slot: { startTime: string }) => slot.startTime === '17:30',
      ),
    ).toBe(false);
    expect(
      partial.body.data.slots.some(
        (slot: { startTime: string }) => slot.startTime === '19:00',
      ),
    ).toBe(true);
  });

  function createRequest(
    key: string,
    startTime: string,
    guestCount: number,
    requestedDate = date,
  ) {
    return request(app.getHttpServer())
      .post('/api/v1/reservations')
      .set('Idempotency-Key', key)
      .send({
        date: requestedDate,
        startTime,
        guestCount,
        guest: {
          name: 'Phase Eight Test',
          email: `${emailPrefix}${key}@example.invalid`,
          phone: '+84900000000',
        },
        specialRequest: 'Phase 8 integration fixture',
      });
  }

  afterAll(async () => {
    await pool.query(
      `DELETE FROM reservation_idempotency
       WHERE idempotency_key IN
         ('happy-path-key', 'replay-key', 'race-left-key', 'race-right-key', 'rollback-validation-key')`,
    );
    await pool.query(
      `DELETE FROM reservations WHERE customer_id IN
       (SELECT id FROM customers WHERE email LIKE $1)`,
      [`${emailPrefix}%`],
    );
    await pool.query(`DELETE FROM customers WHERE email LIKE $1`, [
      `${emailPrefix}%`,
    ]);
    await pool.query(
      `DELETE FROM special_closures
       WHERE reason IN ('phase8-integration-full', 'phase8-integration-partial')`,
    );
    await pool.query(
      `DELETE FROM service_capacities WHERE day_of_week IN (2, 3, 4, 5)`,
    );
    for (const capacity of previousCapacities) {
      await pool.query(
        `INSERT INTO service_capacities (day_of_week, capacity, is_active)
         VALUES ($1, $2, $3)`,
        [capacity.day_of_week, capacity.capacity, capacity.is_active],
      );
    }
    await pool.end();
    await app.close();
  });
});
