import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AdminRole } from '@ember-and-oak/types';

import { ADMIN_ROLES_KEY } from './admin-roles.decorator.js';
import type { AdminRequest } from './admin-session.guard.js';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest<AdminRequest>().adminUser;
    if (!user || (user.role !== 'ADMIN' && !roles.includes(user.role)))
      throw new ForbiddenException('Insufficient admin role');
    return true;
  }
}
