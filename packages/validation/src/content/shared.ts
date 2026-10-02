import { z } from "zod";

export const contentIdSchema = z.string().trim().min(1).max(128);

export const contentSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const publishStateSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const isoDateTimeSchema = z.iso.datetime({ offset: true });

export const isoDateSchema = z.iso.date();

export const displayOrderSchema = z.number().int().nonnegative();

export const optionalTextSchema = z
  .string()
  .trim()
  .min(1)
  .nullish()
  .transform((value) => value ?? undefined);

export const contentTimestampsSchema = z.object({
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  publishedAt: isoDateTimeSchema.optional(),
});

export const seoMetadataSchema = z.object({
  title: z.string().trim().min(1).max(70).optional(),
  description: z.string().trim().min(1).max(320).optional(),
  canonicalPath: z.string().trim().startsWith("/").optional(),
  socialImageId: contentIdSchema.optional(),
  noIndex: z.boolean().optional(),
});
