import { Module } from '@nestjs/common';

import { ReservationModule } from '../reservation/reservation.module.js';
import { AdminContentGuard } from './admin-content.guard.js';
import {
  AdminContentController,
  ContentController,
} from './content.controller.js';
import { ContentRevalidationService } from './content-revalidation.service.js';
import { ContentService } from './content.service.js';

@Module({
  imports: [ReservationModule],
  controllers: [ContentController, AdminContentController],
  providers: [ContentRevalidationService, ContentService, AdminContentGuard],
  exports: [ContentService],
})
export class ContentModule {}
