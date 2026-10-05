import { z } from "zod";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const e164Pattern = /^\+[1-9]\d{7,14}$/;

export const reservationDateSchema = z
  .string()
  .regex(isoDatePattern)
  .refine(
    (value) => {
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(Date.UTC(year!, month! - 1, day));
      return (
        parsed.getUTCFullYear() === year &&
        parsed.getUTCMonth() === month! - 1 &&
        parsed.getUTCDate() === day
      );
    },
    { message: "Invalid calendar date" },
  );

export const reservationTimeSchema = z.string().regex(timePattern);
// The domain enforces the regular-party maximum and returns PARTY_TOO_LARGE.
export const reservationGuestCountSchema = z.number().int().min(1);
export const reservationNameSchema = z.string().trim().min(1).max(120);
export const reservationEmailSchema = z.string().trim().toLowerCase().email().max(254);
export const reservationPhoneSchema = z.string().trim().regex(e164Pattern);
export const specialRequestSchema = z.string().trim().max(1000);

export const reservationStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const reservationGuestSchema = z.object({
  name: reservationNameSchema,
  email: reservationEmailSchema,
  phone: reservationPhoneSchema,
});

export const createReservationSchema = z.object({
  date: reservationDateSchema,
  startTime: reservationTimeSchema,
  guestCount: reservationGuestCountSchema,
  guest: reservationGuestSchema,
  specialRequest: specialRequestSchema.optional(),
});

export const idempotencyKeySchema = z.string().trim().min(8).max(128);
