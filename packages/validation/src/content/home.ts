import type {
  DiningExperience,
  DiningExperienceContent,
  HomeContent,
  HomePage,
} from "@ember-and-oak/types";
import { z } from "zod";

import { chefProfileContentSchema } from "./chef.js";
import { mediaAssetSchema } from "./media.js";
import { menuDishContentSchema } from "./menu.js";
import {
  contentIdSchema,
  contentSlugSchema,
  displayOrderSchema,
  isoDateTimeSchema,
  optionalTextSchema,
  publishStateSchema,
  seoMetadataSchema,
} from "./shared.js";

export const homePageSchema: z.ZodType<HomePage> = z.object({
  id: contentIdSchema,
  slug: contentSlugSchema,
  heroEyebrow: optionalTextSchema,
  heroHeading: z.string().trim().min(1),
  heroDescription: z.string().trim().min(1),
  heroPrimaryMediaId: contentIdSchema,
  philosophyLabel: z.string().trim().min(1),
  philosophyHeading: z.string().trim().min(1),
  philosophyBody: z.string().trim().min(1),
  philosophyMediaId: contentIdSchema.nullish().transform((value) => value ?? undefined),
  atmosphereHeading: z.string().trim().min(1),
  atmosphereBody: optionalTextSchema,
  atmosphereMediaId: contentIdSchema,
  reservationHeading: z.string().trim().min(1),
  reservationBody: optionalTextSchema,
  seo: seoMetadataSchema.optional(),
  publishState: publishStateSchema,
  updatedAt: isoDateTimeSchema,
});

export const diningExperienceSchema: z.ZodType<DiningExperience> = z.object({
  id: contentIdSchema,
  title: z.string().trim().min(1),
  slug: contentSlugSchema,
  description: z.string().trim().min(1),
  priceLabel: optionalTextSchema,
  mediaId: contentIdSchema,
  ctaLabel: optionalTextSchema,
  ctaTarget: z
    .string()
    .trim()
    .startsWith("/")
    .nullish()
    .transform((value) => value ?? undefined),
  displayOrder: displayOrderSchema,
  publishState: publishStateSchema,
});

export const diningExperienceContentSchema: z.ZodType<DiningExperienceContent> = z
  .object({ experience: diningExperienceSchema, media: mediaAssetSchema })
  .refine(({ experience, media }) => experience.mediaId === media.id, {
    path: ["media"],
    message: "Media must resolve experience mediaId",
  });

export const homeContentSchema: z.ZodType<HomeContent> = z
  .object({
    home: homePageSchema,
    heroMedia: mediaAssetSchema,
    philosophyMedia: mediaAssetSchema.optional(),
    atmosphereMedia: mediaAssetSchema,
    featuredDishes: z.array(menuDishContentSchema),
    chef: chefProfileContentSchema,
    experiences: z.array(diningExperienceContentSchema),
  })
  .superRefine((content, context) => {
    const { home } = content;
    if (home.heroPrimaryMediaId !== content.heroMedia.id) {
      context.addIssue({ code: "custom", path: ["heroMedia"], message: "Invalid hero media" });
    }
    if (home.philosophyMediaId !== content.philosophyMedia?.id) {
      context.addIssue({
        code: "custom",
        path: ["philosophyMedia"],
        message: "Invalid philosophy media",
      });
    }
    if (home.atmosphereMediaId !== content.atmosphereMedia.id) {
      context.addIssue({
        code: "custom",
        path: ["atmosphereMedia"],
        message: "Invalid atmosphere media",
      });
    }
  });

export const publishedHomeContentSchema = homeContentSchema.superRefine((content, context) => {
  if (content.home.publishState !== "PUBLISHED") {
    context.addIssue({
      code: "custom",
      path: ["home", "publishState"],
      message: "Public Home content must be published",
    });
  }
  if (content.chef.chef.publishState !== "PUBLISHED") {
    context.addIssue({
      code: "custom",
      path: ["chef", "chef", "publishState"],
      message: "Public Home chef must be published",
    });
  }
  content.featuredDishes.forEach((entry, index) => {
    if (!entry.dish.isFeatured || entry.dish.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["featuredDishes", index, "dish"],
        message: "Home dishes must be featured and published",
      });
    }
  });
  content.experiences.forEach((entry, index) => {
    if (entry.experience.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["experiences", index, "experience", "publishState"],
        message: "Home experiences must be published",
      });
    }
  });
});
