import {
  generateCandidateSlots,
  intervalsOverlap,
} from './reservation-time.js';

describe('reservation time rules', () => {
  it('uses service-end closing semantics', () => {
    const slots = generateCandidateSlots('17:30', '22:30');
    expect(slots.at(-1)).toEqual({ startTime: '20:30', endTime: '22:30' });
    expect(slots).toHaveLength(7);
  });

  it('uses half-open overlap intervals', () => {
    expect(intervalsOverlap('18:00', '20:00', '20:00', '22:00')).toBe(false);
    expect(intervalsOverlap('18:00', '20:00', '19:30', '21:30')).toBe(true);
  });
});
