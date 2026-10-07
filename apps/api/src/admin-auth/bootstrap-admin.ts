import 'dotenv/config';

import { Pool } from 'pg';
import {
  adminEmailSchema,
  adminPasswordSchema,
  adminRoleSchema,
} from '@ember-and-oak/validation';

import { loadEnvironment } from '../config/environment.js';
import { hashPassword } from './password.js';

async function bootstrap(): Promise<void> {
  const email = adminEmailSchema.parse(process.env.ADMIN_BOOTSTRAP_EMAIL);
  const displayName = process.env.ADMIN_BOOTSTRAP_NAME?.trim();
  const password = adminPasswordSchema.parse(
    process.env.ADMIN_BOOTSTRAP_PASSWORD,
  );
  const role = adminRoleSchema.parse(
    process.env.ADMIN_BOOTSTRAP_ROLE ?? 'ADMIN',
  );
  if (!displayName || displayName.length > 120)
    throw new Error('ADMIN_BOOTSTRAP_NAME is required');
  const pool = new Pool({ connectionString: loadEnvironment().DATABASE_URL });
  try {
    const existing = await pool.query(
      'SELECT id FROM admin_users WHERE lower(email) = lower($1)',
      [email],
    );
    if (existing.rowCount) {
      console.log('Admin account already exists; no changes made.');
      return;
    }
    const credential = await hashPassword(password);
    await pool.query(
      `INSERT INTO admin_users (email, display_name, role, password_hash, password_salt)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, displayName, role, credential.hash, credential.salt],
    );
    console.log(`Created ${role} account for ${email}.`);
  } finally {
    await pool.end();
  }
}

void bootstrap();
