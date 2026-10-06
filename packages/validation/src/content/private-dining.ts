import type {
  PrivateDiningContent,
  PrivateDiningExperience,
  PrivateDiningPage,
} from "@ember-and-oak/types";
import { z } from "zod";

import { mediaAssetSchema } from "./media.js";
import {
  contentIdSchema,
  contentSlugSchema,
  displayOrderSchema,
  optionalTextSchema,
  publishStateSchema,
  seoMetadataSchema,
} from "./shared.js";

export const privateDiningPageSchema: z.ZodType<PrivateDiningPage> = z.object({
  id: contentIdSchema,
  slug: contentSlugSchema,
  heroHeading: z.string().trim().min(1),
  heroDescription: z.string().trim().min(1),
  heroMediaId: contentIdSchema,
  introBody: optionalTextSchema,
  enquiryHeading: z.string().trim().min(1),
  enquiryBody: optionalTextSchema,
  seo: seoMetadataSchema.optional(),
  publishState: publishStateSchema,
});

export const privateDiningExperienceSchema: z.ZodType<PrivateDiningExperience> = z
  .object({
    id: contentIdSchema,
    name: z.string().trim().min(1),
    slug: contentSlugSchema,
    description: z.string().trim().min(1),
    capacityMin: z.number().int().positive().optional(),
    capacityMax: z.number().int().positive().optional(),
    capacityLabel: z.string().trim().min(1),
    mediaId: contentIdSchema,
    displayOrder: displayOrderSchema,
    publishState: publishStateSchema,
  })
  .refine(
    (experience) =>
      experience.capacityMin === undefined ||
      experience.capacityMax === undefined ||
      experience.capacityMin <= experience.capacityMax,
    { path: ["capacityMax"], message: "Maximum capacity must not be below minimum" },
  );

export const privateDiningContentSchema: z.ZodType<PrivateDiningContent> = z
  .object({
    page: privateDiningPageSchema,
    heroMedia: mediaAssetSchema,
    experiences: z.array(
      z.object({ experience: privateDiningExperienceSchema, media: mediaAssetSchema }),
    ),
  })
  .superRefine((content, context) => {
    if (content.page.heroMediaId !== content.heroMedia.id) {
      context.addIssue({ code: "custom", path: ["heroMedia"], message: "Invalid hero media" });
    }
    content.experiences.forEach((entry, index) => {
      if (entry.experience.mediaId !== entry.media.id) {
        context.addIssue({
          code: "custom",
          path: ["experiences", index, "media"],
          message: "Invalid experience media",
        });
      }
    });
  });

export const publishedPrivateDiningContentSchema = privateDiningContentSchema.superRefine(
  (content, context) => {
    if (content.page.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["page", "publishState"],
        message: "Page is not published",
      });
    }
    content.experiences.forEach((entry, index) => {
      if (entry.experience.publishState !== "PUBLISHED") {
        context.addIssue({
          code: "custom",
          path: ["experiences", index, "experience", "publishState"],
          message: "Experience is not published",
        });
      }
    });
  },
);
