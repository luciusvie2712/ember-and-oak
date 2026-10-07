import { Module } from '@nestjs/common';

import { ReservationModule } from '../reservation/reservation.module.js';
import { AdminAuthModule } from '../admin-auth/admin-auth.module.js';
import {
  AdminContentController,
  ContentController,
} from './content.controller.js';
import { ContentRevalidationService } from './content-revalidation.service.js';
import { ContentService } from './content.service.js';
import { AdminContentGuard } from './admin-content.guard.js';

@Module({
  imports: [ReservationModule, AdminAuthModule],
  controllers: [ContentController, AdminContentController],
  providers: [ContentRevalidationService, ContentService, AdminContentGuard],
  exports: [ContentService],
})
export class ContentModule {}
