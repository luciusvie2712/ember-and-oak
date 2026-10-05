import { z } from "zod";

export const serviceCapacitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  capacity: z.number().int().positive(),
  isActive: z.boolean(),
});
