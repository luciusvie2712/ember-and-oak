import type { CreatePrivateEventEnquiryInput } from "@ember-and-oak/types";
import { z } from "zod";

import {
  reservationDateSchema,
  reservationEmailSchema,
  reservationNameSchema,
  reservationPhoneSchema,
} from "../reservation/reservation.js";

// Technical abuse guardrail, not a business capacity or pricing rule.
export const PRIVATE_EVENT_GUEST_INPUT_LIMIT = 500;

export const privateEventEnquirySchema: z.ZodType<CreatePrivateEventEnquiryInput> = z.object({
  name: reservationNameSchema,
  email: reservationEmailSchema,
  phone: reservationPhoneSchema,
  eventDate: reservationDateSchema,
  guests: z.number().int().min(1).max(PRIVATE_EVENT_GUEST_INPUT_LIMIT),
  eventType: z.string().trim().min(1).max(120),
  budget: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
});
