import { Injectable } from '@nestjs/common';
import type { AdminRole, AdminUser } from '@ember-and-oak/types';

import { ContentDatabaseService } from '../database/content-database.service.js';

export type AdminCredentialRow = Readonly<{
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  password_hash: string;
  password_salt: string;
  is_active: boolean;
  failed_login_count: number;
  last_failed_login_at: Date | null;
  locked_until: Date | null;
}>;

type SessionRow = Readonly<{
  expires_at: Date;
  session_id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
}>;

@Injectable()
export class AdminAuthRepository {
  constructor(private readonly database: ContentDatabaseService) {}

  async findCredentials(email: string): Promise<AdminCredentialRow | null> {
    const result = await this.database.query<AdminCredentialRow>(
      `SELECT id, email, display_name, role, password_hash, password_salt, is_active,
              failed_login_count, last_failed_login_at, locked_until
       FROM admin_users WHERE lower(email) = lower($1)`,
      [email],
    );
    return result.rows[0] ?? null;
  }

  async recordFailure(
    userId: string,
    maxFailures: number,
    lockMinutes: number,
  ): Promise<void> {
    await this.database.query(
      `UPDATE admin_users SET
         failed_login_count = CASE
           WHEN last_failed_login_at IS NULL OR last_failed_login_at < now() - interval '15 minutes'
             THEN 1 ELSE failed_login_count + 1 END,
         last_failed_login_at = now(),
         locked_until = CASE
           WHEN (CASE WHEN last_failed_login_at IS NULL OR last_failed_login_at < now() - interval '15 minutes'
                 THEN 1 ELSE failed_login_count + 1 END) >= $2
             THEN now() + ($3 * interval '1 minute') ELSE locked_until END,
         updated_at = now()
       WHERE id = $1`,
      [userId, maxFailures, lockMinutes],
    );
  }

  async createSession(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.database.transaction(async (client) => {
      await client.query(
        `UPDATE admin_users SET failed_login_count = 0, last_failed_login_at = NULL,
          locked_until = NULL, last_login_at = now(), updated_at = now() WHERE id = $1`,
        [userId],
      );
      await client.query(
        `INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
        [userId, tokenHash, expiresAt],
      );
    });
  }

  async findSession(
    tokenHash: string,
  ): Promise<{ user: AdminUser; expiresAt: Date } | null> {
    const result = await this.database.query<SessionRow>(
      `SELECT s.id AS session_id, s.expires_at, u.id AS user_id, u.email, u.display_name, u.role, u.is_active
       FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()`,
      [tokenHash],
    );
    const row = result.rows[0];
    if (!row?.is_active) return null;
    await this.database.query(
      'UPDATE admin_sessions SET last_seen_at = now() WHERE id = $1',
      [row.session_id],
    );
    return {
      user: {
        id: row.user_id,
        email: row.email,
        displayName: row.display_name,
        role: row.role,
      },
      expiresAt: row.expires_at,
    };
  }

  async revoke(tokenHash: string): Promise<void> {
    await this.database.query(
      'UPDATE admin_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL',
      [tokenHash],
    );
  }
}
