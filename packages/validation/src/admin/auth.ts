import { z } from "zod";

export const adminRoleSchema = z.enum(["ADMIN", "HOST", "CONTENT_EDITOR"]);
export const adminEmailSchema = z.string().trim().toLowerCase().email().max(254);
export const adminPasswordSchema = z.string().min(12).max(256);
export const adminLoginSchema = z.object({
  email: adminEmailSchema,
  password: adminPasswordSchema,
});
export const adminSessionTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
