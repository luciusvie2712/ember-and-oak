import type {
  Dish,
  Menu,
  MenuCategory,
  MenuCategoryContent,
  MenuContent,
  MenuDishContent,
} from "@ember-and-oak/types";
import { z } from "zod";

import { mediaAssetSchema } from "./media.js";
import {
  contentIdSchema,
  contentSlugSchema,
  contentTimestampsSchema,
  displayOrderSchema,
  isoDateSchema,
  optionalTextSchema,
  publishStateSchema,
  seoMetadataSchema,
} from "./shared.js";

export const menuSchema: z.ZodType<Menu> = z
  .object({
    id: contentIdSchema,
    name: z.string().trim().min(1).max(160),
    slug: contentSlugSchema,
    description: optionalTextSchema,
    seasonLabel: optionalTextSchema,
    validFrom: isoDateSchema.optional(),
    validTo: isoDateSchema.optional(),
    isPrimary: z.boolean(),
    publishState: publishStateSchema,
    seo: seoMetadataSchema.optional(),
    ...contentTimestampsSchema.shape,
  })
  .refine((menu) => !menu.validFrom || !menu.validTo || menu.validFrom <= menu.validTo, {
    path: ["validTo"],
    message: "validTo must not be before validFrom",
  });

export const menuCategorySchema: z.ZodType<MenuCategory> = z.object({
  id: contentIdSchema,
  menuId: contentIdSchema,
  name: z.string().trim().min(1).max(160),
  slug: contentSlugSchema,
  description: optionalTextSchema,
  displayOrder: displayOrderSchema,
  isActive: z.boolean(),
  ...contentTimestampsSchema.shape,
});

export const dishSchema: z.ZodType<Dish> = z.object({
  id: contentIdSchema,
  categoryId: contentIdSchema,
  name: z.string().trim().min(1).max(160),
  slug: contentSlugSchema,
  description: z.string().trim().min(1),
  priceAmount: z.number().finite().nonnegative(),
  currencyCode: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/),
  primaryMediaId: contentIdSchema.optional(),
  isAvailable: z.boolean(),
  seasonalStatus: z.enum(["CORE", "SEASONAL", "LIMITED"]),
  isFeatured: z.boolean(),
  displayOrder: displayOrderSchema,
  publishState: publishStateSchema,
  ...contentTimestampsSchema.shape,
});

export const menuDishContentSchema: z.ZodType<MenuDishContent> = z
  .object({
    dish: dishSchema,
    primaryMedia: mediaAssetSchema.optional(),
  })
  .superRefine(({ dish, primaryMedia }, context) => {
    if (dish.primaryMediaId && dish.primaryMediaId !== primaryMedia?.id) {
      context.addIssue({
        code: "custom",
        path: ["primaryMedia"],
        message: "primaryMedia must resolve the dish primaryMediaId",
      });
    }
  });

export const menuCategoryContentSchema: z.ZodType<MenuCategoryContent> = z
  .object({
    category: menuCategorySchema,
    dishes: z.array(menuDishContentSchema),
  })
  .superRefine(({ category, dishes }, context) => {
    for (const [index, entry] of dishes.entries()) {
      if (entry.dish.categoryId !== category.id) {
        context.addIssue({
          code: "custom",
          path: ["dishes", index, "dish", "categoryId"],
          message: "Dish must belong to its containing category",
        });
      }
    }
  });

export const menuContentSchema: z.ZodType<MenuContent> = z
  .object({
    menu: menuSchema,
    categories: z.array(menuCategoryContentSchema),
  })
  .superRefine(({ menu, categories }, context) => {
    const slugs = new Set<string>();
    for (const [index, entry] of categories.entries()) {
      if (entry.category.menuId !== menu.id) {
        context.addIssue({
          code: "custom",
          path: ["categories", index, "category", "menuId"],
          message: "Category must belong to its containing menu",
        });
      }
      if (slugs.has(entry.category.slug)) {
        context.addIssue({
          code: "custom",
          path: ["categories", index, "category", "slug"],
          message: "Category slugs must be unique within a menu",
        });
      }
      slugs.add(entry.category.slug);
    }
  });

export const publishedMenuContentSchema = menuContentSchema.superRefine(
  ({ menu, categories }, context) => {
    if (menu.publishState !== "PUBLISHED") {
      context.addIssue({
        code: "custom",
        path: ["menu", "publishState"],
        message: "Public menu content must be published",
      });
    }
    for (const [categoryIndex, entry] of categories.entries()) {
      if (!entry.category.isActive) {
        context.addIssue({
          code: "custom",
          path: ["categories", categoryIndex, "category", "isActive"],
          message: "Public menu categories must be active",
        });
      }
      for (const [dishIndex, dishEntry] of entry.dishes.entries()) {
        if (dishEntry.dish.publishState !== "PUBLISHED") {
          context.addIssue({
            code: "custom",
            path: ["categories", categoryIndex, "dishes", dishIndex, "dish", "publishState"],
            message: "Public menu dishes must be published",
          });
        }
      }
    }
  },
);
