import 'dotenv/config';

import { Pool } from 'pg';

import { loadEnvironment } from '../config/environment.js';
import { contentMigrations } from './migrations/content-migrations.js';

async function migrate(): Promise<void> {
  const pool = new Pool({ connectionString: loadEnvironment().DATABASE_URL });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const migration of contentMigrations) {
      const applied = await pool.query<{ id: string }>(
        'SELECT id FROM schema_migrations WHERE id = $1',
        [migration.id],
      );
      if (applied.rowCount) continue;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(migration.sql);
        await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [
          migration.id,
        ]);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

void migrate();
