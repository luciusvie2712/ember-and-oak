import { Module } from '@nestjs/common';
import { AdminAuthModule } from '../admin-auth/admin-auth.module.js';
import { ReservationModule } from '../reservation/reservation.module.js';
import { OpeningHoursRepository } from '../reservation/opening-hours.repository.js';
import { AdminOperationsController } from './admin-operations.controller.js';
import { AdminOperationsService } from './admin-operations.service.js';

@Module({
  imports: [AdminAuthModule, ReservationModule],
  controllers: [AdminOperationsController],
  providers: [AdminOperationsService, OpeningHoursRepository],
})
export class AdminOperationsModule {}
