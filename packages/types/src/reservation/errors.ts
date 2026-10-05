export const reservationErrorCodes = [
  "VALIDATION_ERROR",
  "CLOSED",
  "SPECIAL_CLOSURE",
  "OUTSIDE_BOOKING_WINDOW",
  "SAME_DAY_CUTOFF",
  "PARTY_TOO_LARGE",
  "NO_AVAILABILITY",
  "SLOT_CONFLICT",
  "IDEMPOTENCY_CONFLICT",
  "INVALID_STATE_TRANSITION",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "INTERNAL_ERROR",
] as const;

export type ReservationErrorCode = (typeof reservationErrorCodes)[number];
