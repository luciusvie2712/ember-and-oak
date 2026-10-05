import { Injectable } from '@nestjs/common';
import type {
  CreateReservationInput,
  ReservationSummary,
  ReservationStatus,
} from '@ember-and-oak/types';

import {
  ContentDatabaseService,
  type DatabaseClient,
} from '../database/content-database.service.js';
import { capacityConsumingStatuses } from './reservation-config.js';

export type CapacityReservation = Readonly<{
  startTime: string;
  guestCount: number;
  status: ReservationStatus;
}>;

type CapacityReservationRow = {
  start_time: string;
  guest_count: number;
  status: ReservationStatus;
};

type ReservationRow = {
  id: string;
  reservation_code: string;
  reservation_date: string;
  start_time: string;
  guest_count: number;
  status: ReservationStatus;
  created_at: Date;
};

export type IdempotencyRecord = Readonly<{
  requestHash: string;
  reservationId: string | null;
}>;

@Injectable()
export class ReservationRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async findCapacityConsumingForDate(
    date: string,
    client?: DatabaseClient,
  ): Promise<CapacityReservation[]> {
    const sql = `SELECT start_time, guest_count, status
                 FROM reservations
                 WHERE reservation_date = $1 AND status = ANY($2::text[])`;
    const values = [date, [...capacityConsumingStatuses]];
    const result = client
      ? await client.query<CapacityReservationRow>(sql, values)
      : await this.database.query<CapacityReservationRow>(sql, values);
    return result.rows.map((row) => ({
      startTime: row.start_time.slice(0, 5),
      guestCount: row.guest_count,
      status: row.status,
    }));
  }

  async findSummaryById(
    id: string,
    client: DatabaseClient,
  ): Promise<ReservationSummary | null> {
    const result = await client.query<ReservationRow>(
      `SELECT id, reservation_code,
              to_char(reservation_date, 'YYYY-MM-DD') AS reservation_date,
              start_time,
              guest_count, status, created_at
       FROM reservations WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? this.toSummary(result.rows[0]) : null;
  }

  async create(
    input: CreateReservationInput,
    reservationCode: string,
    client: DatabaseClient,
  ): Promise<ReservationSummary> {
    const customer = await client.query<{ id: string }>(
      `INSERT INTO customers (name, email, phone)
       VALUES ($1, $2, $3) RETURNING id`,
      [input.guest.name, input.guest.email, input.guest.phone],
    );
    const customerId = customer.rows[0]?.id;
    if (!customerId) throw new Error('Customer insert did not return an id');

    const result = await client.query<ReservationRow>(
      `INSERT INTO reservations
         (reservation_code, customer_id, reservation_date, start_time,
          guest_count, status, special_request)
       VALUES ($1, $2, $3, $4, $5, 'CONFIRMED', $6)
       RETURNING id, reservation_code,
                 to_char(reservation_date, 'YYYY-MM-DD') AS reservation_date,
                 start_time,
                 guest_count, status, created_at`,
      [
        reservationCode,
        customerId,
        input.date,
        input.startTime,
        input.guestCount,
        input.specialRequest ?? null,
      ],
    );
    const row = result.rows[0];
    if (!row) throw new Error('Reservation insert did not return a row');
    return this.toSummary(row);
  }

  private toSummary(row: ReservationRow): ReservationSummary {
    return {
      id: row.id,
      reservationCode: row.reservation_code,
      date: row.reservation_date,
      startTime: row.start_time.slice(0, 5),
      guestCount: row.guest_count,
      status: row.status,
      createdAt: row.created_at.toISOString(),
    };
  }
}
