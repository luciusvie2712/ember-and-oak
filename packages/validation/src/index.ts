import { z } from "zod";
export type { ZodType } from "zod";

export const emailSchema = z.string().trim().email();

export const phoneSchema = z.string().trim().min(6).max(32);

export const requestIdSchema = z.string().uuid();

export { z };
