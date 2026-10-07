import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { adminLoginSchema } from '@ember-and-oak/validation';

import { ZodValidationPipe } from '../http/zod-validation.pipe.js';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminSessionGuard, type AdminRequest } from './admin-session.guard.js';

@Controller('v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(adminLoginSchema))
    body: {
      email: string;
      password: string;
    },
  ) {
    return { data: await this.auth.login(body) };
  }

  @Get('me')
  @UseGuards(AdminSessionGuard)
  async me(@Req() request: AdminRequest) {
    return { data: await this.auth.session(request.adminSessionToken!) };
  }

  @Post('logout')
  @UseGuards(AdminSessionGuard)
  async logout(@Req() request: AdminRequest) {
    await this.auth.logout(request.adminSessionToken!);
    return { data: { revoked: true } };
  }
}
