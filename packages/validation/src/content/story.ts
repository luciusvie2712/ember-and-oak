import type {
  StoryContent,
  StoryMediaContent,
  StoryPage,
  StorySectionMedia,
} from "@ember-and-oak/types";
import { z } from "zod";

import { chefProfileContentSchema } from "./chef.js";
import { mediaAssetSchema } from "./media.js";
import {
  contentIdSchema,
  contentSlugSchema,
  displayOrderSchema,
  isoDateTimeSchema,
  optionalTextSchema,
  publishStateSchema,
  seoMetadataSchema,
} from "./shared.js";

export const storySectionKeySchema = z.enum([
  "INTRO",
  "ORIGIN",
  "FOUNDERS",
  "CHEF",
  "PHILOSOPHY",
  "SOURCING",
  "SUSTAINABILITY",
  "DESIGN",
]);

export const storyPageSchema: z.ZodType<StoryPage> = z
  .object({
    id: contentIdSchema,
    slug: contentSlugSchema,
    introHeading: z.string().trim().min(1),
    introBody: optionalTextSchema,
    originHeading: z.string().trim().min(1),
    originBody: z.string().trim().min(1),
    foundersHeading: optionalTextSchema,
    foundersBody: optionalTextSchema,
    philosophyHeading: z.string().trim().min(1),
    philosophyBody: z.string().trim().min(1),
    sourcingHeading: z.string().trim().min(1),
    sourcingBody: z.string().trim().min(1),
    sustainabilityHeading: z.string().trim().min(1),
    sustainabilityBody: z.string().trim().min(1),
    designHeading: z.string().trim().min(1),
    designBody: z.string().trim().min(1),
    chefProfileId: contentIdSchema,
    seo: seoMetadataSchema.optional(),
    publishState: publishStateSchema,
    updatedAt: isoDateTimeSchema,
  })
  .superRefine((story, context) => {
    if (Boolean(story.foundersHeading) !== Boolean(story.foundersBody)) {
      context.addIssue({
        code: "custom",
        path: story.foundersHeading ? ["foundersBody"] : ["foundersHeading"],
        message: "Founders heading and body must be provided together",
      });
    }
  });

export const storySectionMediaSchema: z.ZodType<StorySectionMedia> = z.object({
  storyPageId: contentIdSchema,
  sectionKey: storySectionKeySchema,
  mediaAssetId: contentIdSchema,
  displayOrder: displayOrderSchema,
});

export const storyMediaContentSchema: z.ZodType<StoryMediaContent> = z
  .object({
    relation: storySectionMediaSchema,
    media: mediaAssetSchema,
  })
  .refine(({ relation, media }) => relation.mediaAssetId === media.id, {
    path: ["media"],
    message: "Media must resolve relation mediaAssetId",
  });

export const storyContentSchema: z.ZodType<StoryContent> = z
  .object({
    story: storyPageSchema,
    chef: chefProfileContentSchema,
    sectionMedia: z.array(storyMediaContentSchema),
  })
  .superRefine(({ story, chef, sectionMedia }, context) => {
    if (story.chefProfileId !== chef.chef.id) {
      context.addIssue({
        code: "custom",
        path: ["chef", "chef", "id"],
        message: "Chef must resolve story chefProfileId",
      });
    }
    for (const [index, entry] of sectionMedia.entries()) {
      if (entry.relation.storyPageId !== story.id) {
        context.addIssue({
          code: "custom",
          path: ["sectionMedia", index, "relation", "storyPageId"],
          message: "Section media must belong to the story",
        });
      }
    }
  });

export const publishedStoryContentSchema = storyContentSchema.superRefine(
  ({ story, chef }, context) => {
    if (story.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["story", "publishState"],
        message: "Public story content must be published",
      });
    }
    if (chef.chef.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["chef", "chef", "publishState"],
        message: "Public story chef must be published",
      });
    }
  },
);
