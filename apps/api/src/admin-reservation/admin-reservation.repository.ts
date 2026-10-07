import { Injectable } from '@nestjs/common';
import type {
  AdminReservationDetail,
  AdminReservationListItem,
  AdminReservationListQuery,
  AdminReservationTransitionInput,
  AdminUser,
  ReservationStatus,
} from '@ember-and-oak/types';

import { ContentDatabaseService } from '../database/content-database.service.js';

type ListRow = {
  id: string;
  reservation_code: string;
  reservation_date: string;
  start_time: string;
  guest_count: number;
  status: ReservationStatus;
  guest_name: string;
  created_at: Date;
};

@Injectable()
export class AdminReservationRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async list(
    query: AdminReservationListQuery,
  ): Promise<{ items: AdminReservationListItem[]; nextCursor?: string }> {
    const values: unknown[] = [];
    const clauses: string[] = [];
    const add = (value: unknown) => {
      values.push(value);
      return `$${values.length}`;
    };
    if (query.date) clauses.push(`r.reservation_date = ${add(query.date)}`);
    if (query.status) clauses.push(`r.status = ${add(query.status)}`);
    if (query.guestCount)
      clauses.push(`r.guest_count = ${add(query.guestCount)}`);
    if (query.q) {
      const parameter = add(`%${query.q}%`);
      clauses.push(
        `(c.name ILIKE ${parameter} OR c.email ILIKE ${parameter} OR c.phone ILIKE ${parameter} OR r.reservation_code ILIKE ${parameter})`,
      );
    }
    const offset = query.cursor
      ? Number.parseInt(
          Buffer.from(query.cursor, 'base64url').toString('utf8'),
          10,
        ) || 0
      : 0;
    const limit = query.limit ?? 50;
    values.push(limit + 1);
    const limitParameter = `$${values.length}`;
    values.push(offset);
    const result = await this.database.query<ListRow>(
      `SELECT r.id, r.reservation_code, to_char(r.reservation_date, 'YYYY-MM-DD') AS reservation_date,
              r.start_time, r.guest_count, r.status, c.name AS guest_name, r.created_at
       FROM reservations r JOIN customers c ON c.id = r.customer_id
       ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''}
       ORDER BY r.reservation_date, r.start_time, r.id
       LIMIT ${limitParameter} OFFSET $${values.length}`,
      values,
    );
    const hasMore = result.rows.length > limit;
    const rows = result.rows.slice(0, limit);
    return {
      items: rows.map((row) => this.toListItem(row)),
      ...(hasMore
        ? {
            nextCursor: Buffer.from(String(offset + limit)).toString(
              'base64url',
            ),
          }
        : {}),
    };
  }

  async detail(id: string): Promise<AdminReservationDetail | null> {
    const reservation = await this.database.query<
      ListRow & {
        guest_email: string;
        guest_phone: string;
        special_request: string | null;
        internal_note: string | null;
        updated_at: Date;
        cancelled_at: Date | null;
      }
    >(
      `SELECT r.id, r.reservation_code, to_char(r.reservation_date, 'YYYY-MM-DD') AS reservation_date,
              r.start_time, r.guest_count, r.status, r.special_request, r.internal_note,
              r.created_at, r.updated_at, r.cancelled_at, c.name AS guest_name,
              c.email AS guest_email, c.phone AS guest_phone
       FROM reservations r JOIN customers c ON c.id = r.customer_id WHERE r.id = $1`,
      [id],
    );
    const row = reservation.rows[0];
    if (!row) return null;
    const [events, tables] = await Promise.all([
      this.database.query<{
        id: string;
        from_status: ReservationStatus;
        to_status: ReservationStatus;
        reason: string | null;
        display_name: string;
        created_at: Date;
      }>(
        `SELECT e.id, e.from_status, e.to_status, e.reason, u.display_name, e.created_at
         FROM reservation_status_events e JOIN admin_users u ON u.id = e.actor_admin_user_id
         WHERE e.reservation_id = $1 ORDER BY e.created_at`,
        [id],
      ),
      this.database.query<{ id: string; name: string; capacity: number }>(
        `SELECT t.id, t.name, t.capacity FROM reservation_tables rt
         JOIN dining_tables t ON t.id = rt.table_id WHERE rt.reservation_id = $1 ORDER BY t.name`,
        [id],
      ),
    ]);
    return {
      ...this.toListItem(row),
      guest: {
        name: row.guest_name,
        email: row.guest_email,
        phone: row.guest_phone,
      },
      ...(row.special_request ? { specialRequest: row.special_request } : {}),
      ...(row.internal_note ? { internalNote: row.internal_note } : {}),
      updatedAt: row.updated_at.toISOString(),
      ...(row.cancelled_at
        ? { cancelledAt: row.cancelled_at.toISOString() }
        : {}),
      statusHistory: events.rows.map((event) => ({
        id: event.id,
        fromStatus: event.from_status,
        toStatus: event.to_status,
        ...(event.reason ? { reason: event.reason } : {}),
        actorDisplayName: event.display_name,
        createdAt: event.created_at.toISOString(),
      })),
      assignedTables: tables.rows,
    };
  }

  async transition(
    id: string,
    input: AdminReservationTransitionInput,
    actor: AdminUser,
  ): Promise<AdminReservationDetail | null> {
    await this.database.transaction(async (client) => {
      const locked = await client.query<{ status: ReservationStatus }>(
        'SELECT status FROM reservations WHERE id = $1 FOR UPDATE',
        [id],
      );
      const current = locked.rows[0]?.status;
      if (!current) return;
      if (current !== input.expectedStatus)
        throw new Error('STALE_RESERVATION_STATUS');
      const cancelledAt =
        input.toStatus === 'CANCELLED' ? 'now()' : 'cancelled_at';
      await client.query(
        `UPDATE reservations SET status = $2, cancelled_at = ${cancelledAt}, updated_at = now() WHERE id = $1`,
        [id, input.toStatus],
      );
      await client.query(
        `INSERT INTO reservation_status_events
          (reservation_id, actor_admin_user_id, from_status, to_status, reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, actor.id, current, input.toStatus, input.reason ?? null],
      );
    });
    return this.detail(id);
  }

  async updateNote(
    id: string,
    internalNote: string | null,
  ): Promise<AdminReservationDetail | null> {
    const result = await this.database.query(
      'UPDATE reservations SET internal_note = $2, updated_at = now() WHERE id = $1 RETURNING id',
      [id, internalNote],
    );
    return result.rowCount ? this.detail(id) : null;
  }

  private toListItem(row: ListRow): AdminReservationListItem {
    return {
      id: row.id,
      reservationCode: row.reservation_code,
      date: row.reservation_date,
      startTime: row.start_time.slice(0, 5),
      guestCount: row.guest_count,
      status: row.status,
      guestName: row.guest_name,
      createdAt: row.created_at.toISOString(),
    };
  }
}
