import { Injectable } from '@nestjs/common';

import {
  ContentDatabaseService,
  type DatabaseClient,
} from '../database/content-database.service.js';

type CapacityRow = { capacity: number };

@Injectable()
export class CapacityRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async getCapacityForDay(
    dayOfWeek: number,
    client?: DatabaseClient,
  ): Promise<number | null> {
    const sql = `SELECT capacity FROM service_capacities
                 WHERE day_of_week = $1 AND is_active = true`;
    const result = client
      ? await client.query<CapacityRow>(sql, [dayOfWeek])
      : await this.database.query<CapacityRow>(sql, [dayOfWeek]);
    return result.rows[0]?.capacity ?? null;
  }
}
