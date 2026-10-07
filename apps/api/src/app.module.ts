import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ContentModule } from './content/content.module.js';
import { OperationsModule } from './operations/operations.module.js';
import { PrivateEventModule } from './private-event/private-event.module.js';
import { ReservationModule } from './reservation/reservation.module.js';
import { AdminAuthModule } from './admin-auth/admin-auth.module.js';
import { AdminReservationModule } from './admin-reservation/admin-reservation.module.js';
import { AdminOperationsModule } from './admin-operations/admin-operations.module.js';

@Module({
  imports: [
    AdminAuthModule,
    AdminReservationModule,
    AdminOperationsModule,
    ReservationModule,
    ContentModule,
    OperationsModule,
    PrivateEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
