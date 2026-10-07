import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { loadEnvironment } from '../config/environment.js';
import { AdminAuthService } from '../admin-auth/admin-auth.service.js';
import type { AdminRequest } from '../admin-auth/admin-session.guard.js';

@Injectable()
export class AdminContentGuard implements CanActivate {
  constructor(private readonly auth: AdminAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const configuredKey = loadEnvironment().ADMIN_CONTENT_API_KEY;
    const request = context.switchToHttp().getRequest<Request & AdminRequest>();
    const presentedKey = request.header('x-content-api-key');
    // Explicit legacy/internal automation path. The interactive Admin never sends this header.
    if (configuredKey && presentedKey === configuredKey) return true;

    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('A valid admin session is required');
    }
    const token = authorization.slice(7);
    const session = await this.auth.session(token);
    if (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_EDITOR')
      throw new ForbiddenException('Insufficient admin role');
    request.adminUser = session.user;
    request.adminSessionToken = token;
    return true;
  }
}
