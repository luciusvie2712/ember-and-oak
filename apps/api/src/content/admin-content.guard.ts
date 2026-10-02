import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { loadEnvironment } from '../config/environment.js';

@Injectable()
export class AdminContentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredKey = loadEnvironment().ADMIN_CONTENT_API_KEY;
    const request = context.switchToHttp().getRequest<Request>();
    const presentedKey = request.header('x-content-api-key');

    if (!configuredKey || !presentedKey || presentedKey !== configuredKey) {
      throw new UnauthorizedException(
        'A valid content editor credential is required',
      );
    }
    return true;
  }
}
