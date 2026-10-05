import type { ReservationStatus } from '@ember-and-oak/types';

import { ReservationDomainError } from './reservation.errors.js';

const transitions: Readonly<
  Record<ReservationStatus, readonly ReservationStatus[]>
> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SEATED', 'CANCELLED', 'NO_SHOW'],
  SEATED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function canTransition(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return transitions[from].includes(to);
}

export function assertValidTransition(
  from: ReservationStatus,
  to: ReservationStatus,
): void {
  if (!canTransition(from, to)) {
    throw new ReservationDomainError(
      'INVALID_STATE_TRANSITION',
      `Reservation cannot transition from ${from} to ${to}`,
    );
  }
}
