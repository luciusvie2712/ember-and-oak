import { Pool } from 'pg';

export async function verifyDatabaseConnection(
  connectionString: string,
): Promise<void> {
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 5_000,
  });

  try {
    await pool.query('SELECT 1');
  } finally {
    await pool.end();
  }
}
