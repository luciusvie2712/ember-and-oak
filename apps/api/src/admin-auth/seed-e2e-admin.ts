import 'dotenv/config';

import { Pool } from 'pg';
import {
  adminEmailSchema,
  adminPasswordSchema,
} from '@ember-and-oak/validation';
import { loadEnvironment } from '../config/environment.js';
import { hashPassword } from './password.js';

async function seed(): Promise<void> {
  const email = adminEmailSchema.parse(process.env.ADMIN_E2E_EMAIL);
  const password = adminPasswordSchema.parse(process.env.ADMIN_E2E_PASSWORD);
  const credential = await hashPassword(password);
  const pool = new Pool({ connectionString: loadEnvironment().DATABASE_URL });
  try {
    await pool.query(
      `INSERT INTO admin_users (email, display_name, role, password_hash, password_salt)
       VALUES ($1, 'E2E Administrator', 'ADMIN', $2, $3)
       ON CONFLICT (lower(email)) DO UPDATE SET password_hash=$2, password_salt=$3,
         role='ADMIN', is_active=true, failed_login_count=0, locked_until=NULL, updated_at=now()`,
      [email, credential.hash, credential.salt],
    );
  } finally {
    await pool.end();
  }
}

void seed();
