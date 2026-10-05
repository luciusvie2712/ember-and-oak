import { z } from "zod";

import { reservationDateSchema, reservationTimeSchema } from "./reservation.js";

export const openingHoursSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: reservationTimeSchema.optional(),
    closeTime: reservationTimeSchema.optional(),
    isClosed: z.boolean(),
  })
  .superRefine((value, context) => {
    if (!value.isClosed && (!value.openTime || !value.closeTime)) {
      context.addIssue({ code: "custom", message: "Open days require open and close times" });
    }
  });

export const specialClosureSchema = z
  .object({
    date: reservationDateSchema,
    type: z.enum(["FULL_DAY", "PARTIAL_DAY"]),
    startTime: reservationTimeSchema.optional(),
    endTime: reservationTimeSchema.optional(),
    reason: z.string().trim().min(1).max(500),
    publicMessage: z.string().trim().max(500).optional(),
  })
  .superRefine((value, context) => {
    if (value.type === "PARTIAL_DAY" && (!value.startTime || !value.endTime)) {
      context.addIssue({ code: "custom", message: "Partial closures require a time range" });
    }
    if (value.startTime && value.endTime && value.startTime >= value.endTime) {
      context.addIssue({ code: "custom", message: "Closure start must precede end" });
    }
  });
