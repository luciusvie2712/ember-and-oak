import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminReservationListQuery,
  AdminReservationTransitionInput,
  AdminUser,
} from '@ember-and-oak/types';

import { assertValidTransition } from '../reservation/reservation-state-machine.js';
import { AdminReservationRepository } from './admin-reservation.repository.js';

@Injectable()
export class AdminReservationService {
  constructor(private readonly repository: AdminReservationRepository) {}
  list(query: AdminReservationListQuery) {
    return this.repository.list(query);
  }
  async detail(id: string) {
    const detail = await this.repository.detail(id);
    if (!detail) throw new NotFoundException('Reservation was not found');
    return detail;
  }
  async transition(
    id: string,
    input: AdminReservationTransitionInput,
    actor: AdminUser,
  ) {
    assertValidTransition(input.expectedStatus, input.toStatus);
    if (input.toStatus === 'CANCELLED' && !input.reason?.trim())
      throw new ConflictException('Cancellation reason is required');
    try {
      const detail = await this.repository.transition(id, input, actor);
      if (!detail) throw new NotFoundException('Reservation was not found');
      return detail;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'STALE_RESERVATION_STATUS'
      )
        throw new ConflictException(
          'Reservation status changed; refresh and try again',
        );
      throw error;
    }
  }
  async updateNote(id: string, internalNote: string | null) {
    const detail = await this.repository.updateNote(id, internalNote);
    if (!detail) throw new NotFoundException('Reservation was not found');
    return detail;
  }
}
