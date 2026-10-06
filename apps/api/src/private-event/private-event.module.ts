import { Module } from '@nestjs/common';

import { ReservationModule } from '../reservation/reservation.module.js';
import { PrivateEventController } from './private-event.controller.js';
import { PrivateEventIdempotencyMaintenanceService } from './private-event-idempotency-maintenance.service.js';
import { PrivateEventRepository } from './private-event.repository.js';
import { PrivateEventService } from './private-event.service.js';

@Module({
  imports: [ReservationModule],
  controllers: [PrivateEventController],
  providers: [
    PrivateEventRepository,
    PrivateEventService,
    PrivateEventIdempotencyMaintenanceService,
  ],
})
export class PrivateEventModule {}
