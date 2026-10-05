export const reservationConfig = {
  timezone: 'Asia/Ho_Chi_Minh',
  slotIntervalMinutes: 30,
  durationMinutes: 120,
  bookingWindowDays: 30,
  sameDayCutoffMinutes: 120,
  turnBufferMinutes: 0,
  minimumGuests: 1,
  maximumGuests: 8,
  idempotencyRetentionHours: 24,
} as const;

export const capacityConsumingStatuses = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
] as const;
