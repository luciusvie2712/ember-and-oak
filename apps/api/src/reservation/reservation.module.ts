import { Module } from '@nestjs/common';

import { ContentDatabaseService } from '../database/content-database.service.js';
import { AvailabilityService } from './availability.service.js';
import { CapacityRepository } from './capacity.repository.js';
import { OpeningHoursRepository } from './opening-hours.repository.js';
import { ReservationController } from './reservation.controller.js';
import { ReservationRepository } from './reservation.repository.js';
import { ReservationService } from './reservation.service.js';
import { SpecialClosureRepository } from './special-closure.repository.js';

@Module({
  controllers: [ReservationController],
  providers: [
    ContentDatabaseService,
    OpeningHoursRepository,
    SpecialClosureRepository,
    CapacityRepository,
    ReservationRepository,
    AvailabilityService,
    ReservationService,
  ],
  exports: [ContentDatabaseService],
})
export class ReservationModule {}
