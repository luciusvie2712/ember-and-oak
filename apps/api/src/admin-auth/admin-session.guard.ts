import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AdminUser } from '@ember-and-oak/types';
import type { Request } from 'express';

import { AdminAuthService } from './admin-auth.service.js';

export type AdminRequest = Request & {
  adminUser?: AdminUser;
  adminSessionToken?: string;
};

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly auth: AdminAuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Admin session required');
    const token = authorization.slice(7);
    const session = await this.auth.session(token);
    request.adminUser = session.user;
    request.adminSessionToken = token;
    return true;
  }
}
