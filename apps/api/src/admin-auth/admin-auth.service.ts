import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type {
  AdminLoginInput,
  AdminLoginResult,
  AdminSessionView,
  AdminUser,
} from '@ember-and-oak/types';

import { loadEnvironment } from '../config/environment.js';
import { AdminAuthRepository } from './admin-auth.repository.js';
import { fakePasswordVerification, verifyPassword } from './password.js';
import { createSessionToken, hashSessionToken } from './session-token.js';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);
  constructor(private readonly repository: AdminAuthRepository) {}

  async login(input: AdminLoginInput): Promise<AdminLoginResult> {
    const config = loadEnvironment();
    const row = await this.repository.findCredentials(input.email);
    if (!row) {
      await fakePasswordVerification(input.password);
      this.failed('unknown_account');
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!row.is_active || (row.locked_until && row.locked_until > new Date())) {
      await fakePasswordVerification(input.password);
      this.failed(row.is_active ? 'locked' : 'inactive');
      throw new UnauthorizedException('Invalid credentials');
    }
    if (
      !(await verifyPassword(
        input.password,
        row.password_hash,
        row.password_salt,
      ))
    ) {
      await this.repository.recordFailure(
        row.id,
        config.ADMIN_LOGIN_MAX_FAILURES,
        config.ADMIN_LOGIN_LOCK_MINUTES,
      );
      this.failed('credential_mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }
    const sessionToken = createSessionToken();
    const expiresAt = new Date(
      Date.now() + config.ADMIN_SESSION_TTL_HOURS * 60 * 60 * 1000,
    );
    await this.repository.createSession(
      row.id,
      hashSessionToken(sessionToken),
      expiresAt,
    );
    return {
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      user: this.toUser(row),
    };
  }

  async session(token: string): Promise<AdminSessionView> {
    const session = await this.repository.findSession(hashSessionToken(token));
    if (!session) throw new UnauthorizedException('Invalid or expired session');
    return { user: session.user, expiresAt: session.expiresAt.toISOString() };
  }

  async logout(token: string): Promise<void> {
    await this.repository.revoke(hashSessionToken(token));
  }

  private toUser(row: {
    id: string;
    email: string;
    display_name: string;
    role: AdminUser['role'];
  }): AdminUser {
    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
    };
  }

  private failed(reasonCategory: string): void {
    this.logger.warn(
      JSON.stringify({ event: 'admin.auth.failed', reasonCategory }),
    );
  }
}
