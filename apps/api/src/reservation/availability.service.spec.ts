import { AvailabilityService } from './availability.service.js';

function service(
  overrides: {
    hours?: unknown;
    closures?: unknown[];
    capacity?: number | null;
    reservations?: unknown[];
  } = {},
) {
  return new AvailabilityService(
    {
      findForDay: vi.fn().mockResolvedValue(
        overrides.hours ?? {
          dayOfWeek: 2,
          openTime: '17:30',
          closeTime: '22:30',
          isClosed: false,
        },
      ),
    } as never,
    {
      findForDate: vi.fn().mockResolvedValue(overrides.closures ?? []),
    } as never,
    {
      getCapacityForDay: vi
        .fn()
        .mockResolvedValue(
          overrides.capacity === undefined ? 20 : overrides.capacity,
        ),
    } as never,
    {
      findCapacityConsumingForDate: vi
        .fn()
        .mockResolvedValue(overrides.reservations ?? []),
    } as never,
  );
}

const futureNow = new Date('2026-10-19T00:00:00Z');

describe('AvailabilityService', () => {
  it('generates Tuesday slots through the service-end boundary', async () => {
    const result = await service().getAvailability(
      { date: '2026-10-20', guestCount: 2 },
      undefined,
      futureNow,
    );
    expect(result.status).toBe('AVAILABLE');
    expect(result.slots.at(-1)?.startTime).toBe('20:30');
  });

  it('returns closed for a closed weekday', async () => {
    const result = await service({
      hours: { dayOfWeek: 1, isClosed: true },
    }).getAvailability(
      { date: '2026-10-19', guestCount: 2 },
      undefined,
      new Date('2026-10-18T00:00:00Z'),
    );
    expect(result.status).toBe('CLOSED');
  });

  it('honors full-day and partial closures', async () => {
    const full = await service({
      closures: [{ type: 'FULL_DAY' }],
    }).getAvailability(
      { date: '2026-10-20', guestCount: 2 },
      undefined,
      futureNow,
    );
    expect(full.status).toBe('SPECIAL_CLOSURE');

    const partial = await service({
      closures: [{ type: 'PARTIAL_DAY', startTime: '18:00', endTime: '19:00' }],
    }).getAvailability(
      { date: '2026-10-20', guestCount: 2 },
      undefined,
      futureNow,
    );
    expect(partial.slots.some((slot) => slot.startTime === '17:30')).toBe(
      false,
    );
  });

  it('subtracts only overlapping active capacity', async () => {
    const result = await service({
      capacity: 8,
      reservations: [
        { startTime: '18:30', guestCount: 6, status: 'CONFIRMED' },
      ],
    }).getAvailability(
      { date: '2026-10-20', guestCount: 3 },
      undefined,
      futureNow,
    );
    expect(
      result.slots.find((slot) => slot.startTime === '18:30'),
    ).toMatchObject({
      available: false,
      remainingCapacity: 2,
    });
    expect(
      result.slots.find((slot) => slot.startTime === '20:30'),
    ).toMatchObject({
      available: true,
      remainingCapacity: 8,
    });
  });

  it('rejects past, beyond-window, and oversized requests', async () => {
    await expect(
      service().getAvailability(
        { date: '2026-10-18', guestCount: 2 },
        undefined,
        futureNow,
      ),
    ).rejects.toMatchObject({ code: 'OUTSIDE_BOOKING_WINDOW' });
    await expect(
      service().getAvailability(
        { date: '2026-11-19', guestCount: 2 },
        undefined,
        futureNow,
      ),
    ).rejects.toMatchObject({ code: 'OUTSIDE_BOOKING_WINDOW' });
    await expect(
      service().getAvailability(
        { date: '2026-10-20', guestCount: 9 },
        undefined,
        futureNow,
      ),
    ).rejects.toMatchObject({ code: 'PARTY_TOO_LARGE' });
  });

  it('applies the exact same-day 120-minute cutoff inclusively', async () => {
    const result = await service({
      hours: {
        dayOfWeek: 2,
        openTime: '17:30',
        closeTime: '22:30',
        isClosed: false,
      },
    }).getAvailability(
      { date: '2026-10-20', guestCount: 2 },
      undefined,
      new Date('2026-10-20T08:30:00Z'),
    );
    expect(result.slots[0]?.startTime).toBe('17:30');
  });
});
