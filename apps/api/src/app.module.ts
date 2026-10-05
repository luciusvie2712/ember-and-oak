import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AdminContentGuard } from './content/admin-content.guard.js';
import {
  AdminContentController,
  ContentController,
} from './content/content.controller.js';
import { ContentRevalidationService } from './content/content-revalidation.service.js';
import { ContentService } from './content/content.service.js';
import { ReservationModule } from './reservation/reservation.module.js';

@Module({
  imports: [ReservationModule],
  controllers: [AppController, ContentController, AdminContentController],
  providers: [
    AppService,
    ContentRevalidationService,
    ContentService,
    AdminContentGuard,
  ],
})
export class AppModule {}
