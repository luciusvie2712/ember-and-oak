import { ReservationIdempotencyMaintenanceService } from './reservation-idempotency-maintenance.service.js';

describe('ReservationIdempotencyMaintenanceService', () => {
  it('deletes expired rows without exposing request data', async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 3 });
    const service = new ReservationIdempotencyMaintenanceService({
      query,
    } as never);

    await expect(service.cleanupExpired()).resolves.toBe(3);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE expires_at <= now()'),
    );
    expect(query.mock.calls[0]).toHaveLength(1);
  });

  it('returns zero when no rows expired', async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 0 });
    const service = new ReservationIdempotencyMaintenanceService({
      query,
    } as never);
    await expect(service.cleanupExpired()).resolves.toBe(0);
  });
});
