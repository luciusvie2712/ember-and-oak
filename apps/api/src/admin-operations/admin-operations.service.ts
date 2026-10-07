import { Injectable, NotFoundException } from '@nestjs/common';
import type { OpeningHours } from '@ember-and-oak/types';

import { ContentDatabaseService } from '../database/content-database.service.js';
import { OpeningHoursRepository } from '../reservation/opening-hours.repository.js';

type ClosureInput = {
  date: string;
  type: 'FULL_DAY' | 'PARTIAL_DAY';
  startTime?: string;
  endTime?: string;
  reason: string;
  publicMessage?: string;
  isActive?: boolean;
};

@Injectable()
export class AdminOperationsService {
  constructor(
    private readonly database: ContentDatabaseService,
    private readonly hours: OpeningHoursRepository,
  ) {}
  openingHours() {
    return this.hours.findAll();
  }
  async updateOpeningHours(
    dayOfWeek: number,
    input: Omit<OpeningHours, 'dayOfWeek'>,
  ) {
    const result = await this.database.query(
      `UPDATE opening_hours SET open_time = $2, close_time = $3, is_closed = $4 WHERE day_of_week = $1 RETURNING day_of_week`,
      [
        dayOfWeek,
        input.isClosed ? null : input.openTime,
        input.isClosed ? null : input.closeTime,
        input.isClosed,
      ],
    );
    if (!result.rowCount)
      throw new NotFoundException('Opening-hours day was not found');
    return this.hours.findForDay(dayOfWeek);
  }
  async closures() {
    const result = await this.database.query<any>(
      `SELECT id, to_char(closure_date, 'YYYY-MM-DD') AS date, closure_type AS type,
              start_time, end_time, reason, public_message, is_active
       FROM special_closures ORDER BY closure_date DESC, start_time NULLS FIRST`,
    );
    return result.rows.map((row) => ({
      id: row.id,
      date: row.date,
      type: row.type,
      ...(row.start_time ? { startTime: row.start_time.slice(0, 5) } : {}),
      ...(row.end_time ? { endTime: row.end_time.slice(0, 5) } : {}),
      reason: row.reason,
      ...(row.public_message ? { publicMessage: row.public_message } : {}),
      isActive: row.is_active,
    }));
  }
  async createClosure(input: ClosureInput) {
    const result = await this.database.query<{ id: string }>(
      `INSERT INTO special_closures (closure_date, closure_type, start_time, end_time, reason, public_message, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id`,
      [
        input.date,
        input.type,
        input.startTime ?? null,
        input.endTime ?? null,
        input.reason,
        input.publicMessage ?? null,
      ],
    );
    return { id: result.rows[0]!.id, ...input, isActive: true };
  }
  async updateClosure(id: string, input: ClosureInput) {
    const result = await this.database.query(
      `UPDATE special_closures SET closure_date=$2, closure_type=$3, start_time=$4, end_time=$5,
         reason=$6, public_message=$7, is_active=$8, updated_at=now() WHERE id=$1 RETURNING id`,
      [
        id,
        input.date,
        input.type,
        input.startTime ?? null,
        input.endTime ?? null,
        input.reason,
        input.publicMessage ?? null,
        input.isActive ?? true,
      ],
    );
    if (!result.rowCount)
      throw new NotFoundException('Special closure was not found');
    return { id, ...input };
  }
  async deactivateClosure(id: string) {
    const result = await this.database.query(
      'UPDATE special_closures SET is_active=false, updated_at=now() WHERE id=$1 RETURNING id',
      [id],
    );
    if (!result.rowCount)
      throw new NotFoundException('Special closure was not found');
    return { id, isActive: false };
  }
}
