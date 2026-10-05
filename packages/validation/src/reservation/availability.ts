import { z } from "zod";

import { reservationDateSchema, reservationGuestCountSchema } from "./reservation.js";

export const availabilityQuerySchema = z.object({
  date: reservationDateSchema,
  guestCount: reservationGuestCountSchema,
});

export const availabilityHttpQuerySchema = z.object({
  date: reservationDateSchema,
  guests: z.coerce.number().int().min(1).max(8),
});
