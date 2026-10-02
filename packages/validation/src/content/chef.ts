import type { ChefProfile, ChefProfileContent } from "@ember-and-oak/types";
import { z } from "zod";

import { mediaAssetSchema } from "./media.js";
import {
  contentIdSchema,
  isoDateTimeSchema,
  optionalTextSchema,
  publishStateSchema,
} from "./shared.js";

export const chefProfileSchema: z.ZodType<ChefProfile> = z.object({
  id: contentIdSchema,
  name: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160),
  shortBio: z.string().trim().min(1),
  fullBio: optionalTextSchema,
  philosophy: optionalTextSchema,
  quote: optionalTextSchema,
  portraitMediaId: contentIdSchema,
  secondaryMediaIds: z.array(contentIdSchema),
  signatureMediaId: contentIdSchema.optional(),
  publishState: publishStateSchema,
  updatedAt: isoDateTimeSchema,
});

export const chefProfileContentSchema: z.ZodType<ChefProfileContent> = z
  .object({
    chef: chefProfileSchema,
    portrait: mediaAssetSchema,
    secondaryMedia: z.array(mediaAssetSchema),
    signatureMedia: mediaAssetSchema.optional(),
  })
  .superRefine(({ chef, portrait, secondaryMedia, signatureMedia }, context) => {
    if (chef.portraitMediaId !== portrait.id) {
      context.addIssue({
        code: "custom",
        path: ["portrait"],
        message: "Portrait must resolve portraitMediaId",
      });
    }
    if (
      chef.secondaryMediaIds.length !== secondaryMedia.length ||
      chef.secondaryMediaIds.some((id, index) => id !== secondaryMedia[index]?.id)
    ) {
      context.addIssue({
        code: "custom",
        path: ["secondaryMedia"],
        message: "Secondary media must resolve secondaryMediaIds in order",
      });
    }
    if (chef.signatureMediaId !== signatureMedia?.id) {
      context.addIssue({
        code: "custom",
        path: ["signatureMedia"],
        message: "Signature media must resolve signatureMediaId",
      });
    }
  });

export const publishedChefProfileContentSchema = chefProfileContentSchema.refine(
  ({ chef }) => chef.publishState === "PUBLISHED",
  {
    path: ["chef", "publishState"],
    message: "Public chef content must be published",
  },
);
