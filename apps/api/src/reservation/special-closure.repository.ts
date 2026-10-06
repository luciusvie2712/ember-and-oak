import { Injectable } from '@nestjs/common';
import type { SpecialClosure, SpecialClosureType } from '@ember-and-oak/types';
import type { PublicSpecialClosure } from '@ember-and-oak/types';

import {
  ContentDatabaseService,
  type DatabaseClient,
} from '../database/content-database.service.js';

type ClosureRow = {
  id: string;
  closure_date: string;
  closure_type: SpecialClosureType;
  start_time: string | null;
  end_time: string | null;
  reason: string;
  public_message: string | null;
};

@Injectable()
export class SpecialClosureRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async findPublicUpcoming(fromDate: string): Promise<PublicSpecialClosure[]> {
    const result = await this.database.query<
      Pick<
        ClosureRow,
        | 'closure_date'
        | 'closure_type'
        | 'start_time'
        | 'end_time'
        | 'public_message'
      >
    >(
      `SELECT to_char(closure_date, 'YYYY-MM-DD') AS closure_date,
              closure_type, start_time, end_time, public_message
       FROM special_closures
       WHERE is_active = true AND closure_date >= $1
       ORDER BY closure_date, start_time NULLS FIRST`,
      [fromDate],
    );
    return result.rows.map((row) => ({
      date: row.closure_date,
      type: row.closure_type,
      ...(row.start_time ? { startTime: row.start_time.slice(0, 5) } : {}),
      ...(row.end_time ? { endTime: row.end_time.slice(0, 5) } : {}),
      ...(row.public_message ? { publicMessage: row.public_message } : {}),
    }));
  }

  async findForDate(
    date: string,
    client?: DatabaseClient,
  ): Promise<SpecialClosure[]> {
    const sql = `SELECT id,
                        to_char(closure_date, 'YYYY-MM-DD') AS closure_date,
                        closure_type, start_time, end_time, reason, public_message
                 FROM special_closures
                 WHERE closure_date = $1 AND is_active = true
                 ORDER BY start_time NULLS FIRST`;
    const result = client
      ? await client.query<ClosureRow>(sql, [date])
      : await this.database.query<ClosureRow>(sql, [date]);
    return result.rows.map((row) => ({
      id: row.id,
      date: row.closure_date,
      type: row.closure_type,
      reason: row.reason,
      ...(row.start_time ? { startTime: row.start_time.slice(0, 5) } : {}),
      ...(row.end_time ? { endTime: row.end_time.slice(0, 5) } : {}),
      ...(row.public_message ? { publicMessage: row.public_message } : {}),
    }));
  }
}
