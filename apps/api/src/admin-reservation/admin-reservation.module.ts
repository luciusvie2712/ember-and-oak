import { Module } from '@nestjs/common';
import { AdminAuthModule } from '../admin-auth/admin-auth.module.js';
import { ReservationModule } from '../reservation/reservation.module.js';
import { AdminReservationController } from './admin-reservation.controller.js';
import { AdminReservationRepository } from './admin-reservation.repository.js';
import { AdminReservationService } from './admin-reservation.service.js';

@Module({
  imports: [AdminAuthModule, ReservationModule],
  controllers: [AdminReservationController],
  providers: [AdminReservationRepository, AdminReservationService],
})
export class AdminReservationModule {}
