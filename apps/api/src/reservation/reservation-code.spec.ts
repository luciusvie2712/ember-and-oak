import { generateReservationCode } from './reservation-code.js';

describe('reservation code', () => {
  it('creates non-sequential, public-safe codes', () => {
    const codes = new Set(Array.from({ length: 50 }, generateReservationCode));
    expect(codes.size).toBe(50);
    for (const code of codes) expect(code).toMatch(/^EO-[A-HJ-NP-Z2-9]{6}$/);
  });
});
