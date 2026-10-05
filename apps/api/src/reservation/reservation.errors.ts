import type { ReservationErrorCode } from '@ember-and-oak/types';

export class ReservationDomainError extends Error {
  constructor(
    readonly code: ReservationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ReservationDomainError';
  }
}
