import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, type PoolClient, type QueryResultRow } from 'pg';

import { loadEnvironment } from '../config/environment.js';

@Injectable()
export class ContentDatabaseService implements OnModuleDestroy {
  private pool?: Pool;

  private getPool(): Pool {
    this.pool ??= new Pool({
      connectionString: loadEnvironment().DATABASE_URL,
    });
    return this.pool;
  }

  query<T extends QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ) {
    return this.getPool().query<T>(text, [...values]);
  }

  async transaction<T>(
    operation: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.getPool().connect();
    try {
      await client.query('BEGIN');
      const result = await operation(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }
}
