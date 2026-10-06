import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module.js';
import { ReservationModule } from '../reservation/reservation.module.js';
import { OpeningHoursRepository } from '../reservation/opening-hours.repository.js';
import { SpecialClosureRepository } from '../reservation/special-closure.repository.js';
import { OperationsController } from './operations.controller.js';
import { OperationsService } from './operations.service.js';

@Module({
  imports: [ContentModule, ReservationModule],
  controllers: [OperationsController],
  providers: [
    OperationsService,
    OpeningHoursRepository,
    SpecialClosureRepository,
  ],
})
export class OperationsModule {}
