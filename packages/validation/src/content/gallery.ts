import type {
  GalleryCategory,
  GalleryCategoryContent,
  GalleryContent,
  GalleryItem,
  GalleryItemContent,
} from "@ember-and-oak/types";
import { z } from "zod";

import { mediaAssetSchema } from "./media.js";
import {
  contentIdSchema,
  contentSlugSchema,
  contentTimestampsSchema,
  displayOrderSchema,
  optionalTextSchema,
  publishStateSchema,
} from "./shared.js";

export const galleryCategorySchema: z.ZodType<GalleryCategory> = z.object({
  id: contentIdSchema,
  name: z.string().trim().min(1).max(160),
  slug: contentSlugSchema,
  displayOrder: displayOrderSchema,
  isActive: z.boolean(),
});

export const galleryItemSchema: z.ZodType<GalleryItem> = z.object({
  id: contentIdSchema,
  categoryId: contentIdSchema,
  mediaAssetId: contentIdSchema,
  altText: optionalTextSchema,
  caption: optionalTextSchema,
  displayOrder: displayOrderSchema,
  publishState: publishStateSchema,
  ...contentTimestampsSchema.shape,
});

export const galleryItemContentSchema: z.ZodType<GalleryItemContent> = z
  .object({
    item: galleryItemSchema,
    media: mediaAssetSchema,
  })
  .superRefine(({ item, media }, context) => {
    if (item.mediaAssetId !== media.id) {
      context.addIssue({
        code: "custom",
        path: ["media"],
        message: "Media must resolve item mediaAssetId",
      });
    }
    if (!media.isDecorative && !item.altText && !media.altText) {
      context.addIssue({
        code: "custom",
        path: ["item", "altText"],
        message: "Informative gallery media requires contextual or asset alt text",
      });
    }
  });

export const galleryCategoryContentSchema: z.ZodType<GalleryCategoryContent> = z
  .object({
    category: galleryCategorySchema,
    items: z.array(galleryItemContentSchema),
  })
  .superRefine(({ category, items }, context) => {
    for (const [index, entry] of items.entries()) {
      if (entry.item.categoryId !== category.id) {
        context.addIssue({
          code: "custom",
          path: ["items", index, "item", "categoryId"],
          message: "Gallery item must belong to its containing category",
        });
      }
    }
  });

export const galleryContentSchema: z.ZodType<GalleryContent> = z.object({
  categories: z.array(galleryCategoryContentSchema),
});

export const publishedGalleryContentSchema = galleryContentSchema.superRefine(
  ({ categories }, context) => {
    for (const [categoryIndex, entry] of categories.entries()) {
      if (!entry.category.isActive) {
        context.addIssue({
          code: "custom",
          path: ["categories", categoryIndex, "category", "isActive"],
          message: "Public gallery categories must be active",
        });
      }
      for (const [itemIndex, itemEntry] of entry.items.entries()) {
        if (itemEntry.item.publishState !== "PUBLISHED") {
          context.addIssue({
            code: "custom",
            path: ["categories", categoryIndex, "items", itemIndex, "item", "publishState"],
            message: "Public gallery items must be published",
          });
        }
      }
    }
  },
);
