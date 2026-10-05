import type { ReservationStatus } from '@ember-and-oak/types';

import {
  assertValidTransition,
  canTransition,
} from './reservation-state-machine.js';

describe('reservation state machine', () => {
  const allowed: Array<[ReservationStatus, ReservationStatus]> = [
    ['PENDING', 'CONFIRMED'],
    ['PENDING', 'CANCELLED'],
    ['CONFIRMED', 'SEATED'],
    ['CONFIRMED', 'CANCELLED'],
    ['CONFIRMED', 'NO_SHOW'],
    ['SEATED', 'COMPLETED'],
  ];

  it.each(allowed)('allows %s -> %s', (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  it.each<ReservationStatus>(['COMPLETED', 'CANCELLED', 'NO_SHOW'])(
    'treats %s as terminal',
    (from) => {
      for (const to of ['PENDING', 'CONFIRMED', 'SEATED'] as const) {
        expect(canTransition(from, to)).toBe(false);
      }
    },
  );

  it('throws a stable domain error for invalid transitions', () => {
    expect(() => assertValidTransition('PENDING', 'COMPLETED')).toThrow(
      expect.objectContaining({ code: 'INVALID_STATE_TRANSITION' }),
    );
  });
});
