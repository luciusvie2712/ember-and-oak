import { z } from "zod";
import { reservationDateSchema, reservationStatusSchema } from "../reservation/reservation.js";

export const adminReservationListQuerySchema = z.object({
  date: reservationDateSchema.optional(),
  status: reservationStatusSchema.optional(),
  q: z.string().trim().max(254).optional(),
  guestCount: z.coerce.number().int().min(1).optional(),
  cursor: z.string().trim().max(256).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const adminReservationTransitionSchema = z.object({
  toStatus: reservationStatusSchema,
  expectedStatus: reservationStatusSchema,
  reason: z.string().trim().min(1).max(500).nullable().optional(),
});

export const adminReservationNoteSchema = z.object({
  internalNote: z.string().trim().max(2000).nullable(),
});
