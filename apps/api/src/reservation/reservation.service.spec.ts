import {
  hashReservationRequest,
  normalizeCreateReservationInput,
} from './reservation.service.js';

const input = {
  date: '2026-10-20',
  startTime: '19:00',
  guestCount: 2,
  guest: {
    name: '  Phase   Eight  ',
    email: 'GUEST@EXAMPLE.COM ',
    phone: '+84901234567',
  },
};

describe('reservation request normalization', () => {
  it('normalizes material request fields deterministically', () => {
    expect(normalizeCreateReservationInput(input)).toMatchObject({
      guest: { name: 'Phase Eight', email: 'guest@example.com' },
    });
    expect(hashReservationRequest(input)).toBe(
      hashReservationRequest(normalizeCreateReservationInput(input)),
    );
  });

  it('changes the hash when a material field changes', () => {
    expect(hashReservationRequest(input)).not.toBe(
      hashReservationRequest({ ...input, guestCount: 3 }),
    );
  });
});
