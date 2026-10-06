import type {
  EditorialPolicy,
  OperationalEditorialContent,
  PublicContactInformation,
  PublicOpeningHours,
  PublicOperations,
  PublicPolicy,
  PublicRestaurantLocation,
  PublicSpecialClosure,
} from "@ember-and-oak/types";
import { z } from "zod";

import { reservationDateSchema, reservationPhoneSchema } from "../reservation/reservation.js";
import { contentSlugSchema, publishStateSchema } from "./shared.js";

const optionalLine = z.string().trim().min(1).max(200).optional();
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const publicRestaurantLocationSchema: z.ZodType<PublicRestaurantLocation> = z.object({
  name: z.string().trim().min(1).max(120),
  addressLine1: z.string().trim().min(1).max(200),
  addressLine2: optionalLine,
  wardOrDistrict: optionalLine,
  city: z.string().trim().min(1).max(120),
  region: optionalLine,
  postalCode: optionalLine,
  countryCode: z.string().regex(/^[A-Z]{2}$/),
  timezone: z.literal("Asia/Ho_Chi_Minh"),
  directionsUrl: z.url().startsWith("https://").optional(),
});

export const publicContactInformationSchema: z.ZodType<PublicContactInformation> = z.object({
  email: z.email().max(254),
  phoneDisplay: z.string().trim().min(1).max(40),
  phoneE164: reservationPhoneSchema,
  instagramUrl: z.url().startsWith("https://").optional(),
  facebookUrl: z.url().startsWith("https://").optional(),
});

export const publicOpeningHoursSchema: z.ZodType<PublicOpeningHours> = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: timeSchema.optional(),
    closeTime: timeSchema.optional(),
    isClosed: z.boolean(),
  })
  .refine(
    (hours) =>
      hours.isClosed
        ? hours.openTime === undefined && hours.closeTime === undefined
        : Boolean(hours.openTime && hours.closeTime && hours.openTime < hours.closeTime),
    { message: "Opening hours must match closed state" },
  );

export const publicSpecialClosureSchema: z.ZodType<PublicSpecialClosure> = z.object({
  date: reservationDateSchema,
  type: z.enum(["FULL_DAY", "PARTIAL_DAY"]),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
  publicMessage: optionalLine,
});

const policyShape = {
  type: z.enum(["DRESS_CODE", "RESERVATION", "CANCELLATION", "PRIVACY", "TERMS"]),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(10_000),
};

export const publicPolicySchema: z.ZodType<PublicPolicy> = z.object(policyShape);

export const editorialPolicySchema: z.ZodType<EditorialPolicy> = z.object({
  ...policyShape,
  publishState: publishStateSchema,
});

export const operationalEditorialContentSchema: z.ZodType<OperationalEditorialContent> = z.object({
  slug: contentSlugSchema,
  location: publicRestaurantLocationSchema,
  contact: publicContactInformationSchema,
  policies: z.array(editorialPolicySchema),
  publishState: publishStateSchema,
});

export const publishedOperationalEditorialContentSchema = operationalEditorialContentSchema.refine(
  (content) => content.publishState === "PUBLISHED",
  { path: ["publishState"], message: "Operations content is not published" },
);

export const publicOperationsSchema: z.ZodType<PublicOperations> = z.object({
  location: publicRestaurantLocationSchema,
  contact: publicContactInformationSchema,
  openingHours: z.array(publicOpeningHoursSchema),
  specialClosures: z.array(publicSpecialClosureSchema),
  policies: z.array(publicPolicySchema),
});
