import { Module } from '@nestjs/common';

import { AdminAuthController } from './admin-auth.controller.js';
import { AdminAuthRepository } from './admin-auth.repository.js';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminRolesGuard } from './admin-roles.guard.js';
import { AdminSessionGuard } from './admin-session.guard.js';
import { ReservationModule } from '../reservation/reservation.module.js';

@Module({
  imports: [ReservationModule],
  controllers: [AdminAuthController],
  providers: [
    AdminAuthRepository,
    AdminAuthService,
    AdminSessionGuard,
    AdminRolesGuard,
  ],
  exports: [AdminAuthService, AdminSessionGuard, AdminRolesGuard],
})
export class AdminAuthModule {}
