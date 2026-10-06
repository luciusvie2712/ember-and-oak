import { Injectable } from '@nestjs/common';
import type { OpeningHours } from '@ember-and-oak/types';

import {
  ContentDatabaseService,
  type DatabaseClient,
} from '../database/content-database.service.js';

type OpeningHoursRow = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

@Injectable()
export class OpeningHoursRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async findAll(): Promise<OpeningHours[]> {
    const result = await this.database.query<OpeningHoursRow>(
      `SELECT day_of_week, open_time, close_time, is_closed
       FROM opening_hours ORDER BY day_of_week`,
    );
    return result.rows.map((row) => ({
      dayOfWeek: row.day_of_week,
      ...(row.open_time ? { openTime: row.open_time.slice(0, 5) } : {}),
      ...(row.close_time ? { closeTime: row.close_time.slice(0, 5) } : {}),
      isClosed: row.is_closed,
    }));
  }

  async findForDay(
    dayOfWeek: number,
    client?: DatabaseClient,
  ): Promise<OpeningHours | null> {
    const sql = `SELECT day_of_week, open_time, close_time, is_closed
                 FROM opening_hours WHERE day_of_week = $1`;
    const result = client
      ? await client.query<OpeningHoursRow>(sql, [dayOfWeek])
      : await this.database.query<OpeningHoursRow>(sql, [dayOfWeek]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      dayOfWeek: row.day_of_week,
      ...(row.open_time ? { openTime: row.open_time.slice(0, 5) } : {}),
      ...(row.close_time ? { closeTime: row.close_time.slice(0, 5) } : {}),
      isClosed: row.is_closed,
    };
  }
}
