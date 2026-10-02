import { describe, expect, it } from "vitest";

import { galleryItemContentSchema } from "./gallery.js";
import { mediaAssetSchema } from "./media.js";
import { dishSchema, publishedMenuContentSchema } from "./menu.js";
import { storyPageSchema } from "./story.js";

const timestamp = "2026-10-02T12:00:00.000Z";

const media = {
  id: "media-1",
  assetType: "IMAGE" as const,
  sourceUrl: "https://cdn.example.com/media-1.webp",
  mimeType: "image/webp",
  width: 1200,
  height: 800,
  aspectRatio: 1.5,
  altText: "A plated seasonal dish",
  isDecorative: false,
  createdAt: timestamp,
  updatedAt: timestamp,
};

const dish = {
  id: "dish-1",
  categoryId: "category-1",
  name: "Ember-roasted roots",
  slug: "ember-roasted-roots",
  description: "Cultured cream and garden herbs.",
  priceAmount: 35,
  currencyCode: "USD",
  isAvailable: false,
  seasonalStatus: "SEASONAL" as const,
  isFeatured: true,
  displayOrder: 0,
  publishState: "PUBLISHED" as const,
  createdAt: timestamp,
  updatedAt: timestamp,
};

describe("Phase 7 content validation", () => {
  it("keeps price numeric, currency explicit, and availability separate from publish state", () => {
    expect(dishSchema.parse(dish)).toMatchObject({
      priceAmount: 35,
      currencyCode: "USD",
      isAvailable: false,
      publishState: "PUBLISHED",
    });
    expect(dishSchema.safeParse({ ...dish, priceAmount: -1 }).success).toBe(false);
    expect(dishSchema.safeParse({ ...dish, currencyCode: "usd" }).success).toBe(false);
    expect(dishSchema.safeParse({ ...dish, priceAmount: "$35" }).success).toBe(false);
  });

  it("requires alt text for informative media and permits an explicit decorative asset", () => {
    expect(mediaAssetSchema.safeParse({ ...media, altText: undefined }).success).toBe(false);
    expect(
      mediaAssetSchema.safeParse({
        ...media,
        altText: undefined,
        isDecorative: true,
      }).success,
    ).toBe(true);
  });

  it("checks dimensions against the canonical aspect ratio", () => {
    expect(mediaAssetSchema.safeParse({ ...media, aspectRatio: 1 }).success).toBe(false);
  });

  it("allows the optional founders section to be absent without weakening required story sections", () => {
    const story = {
      id: "story-1",
      slug: "our-story",
      introHeading: "A restaurant shaped by fire",
      originHeading: "Origin",
      originBody: "Our beginning.",
      philosophyHeading: "Philosophy",
      philosophyBody: "Ingredient first.",
      sourcingHeading: "Sourcing",
      sourcingBody: "Close relationships with growers.",
      sustainabilityHeading: "Sustainability",
      sustainabilityBody: "Use with care.",
      designHeading: "Restaurant design",
      designBody: "A warm room.",
      chefProfileId: "chef-1",
      publishState: "DRAFT",
      updatedAt: timestamp,
    };

    const missingFounders = storyPageSchema.safeParse({
      ...story,
      foundersHeading: null,
      foundersBody: null,
    });

    expect(missingFounders.success).toBe(true);
    if (missingFounders.success) {
      expect(missingFounders.data.foundersHeading).toBeUndefined();
      expect(missingFounders.data.foundersBody).toBeUndefined();
    }
    expect(storyPageSchema.safeParse({ ...story, foundersHeading: "Founders" }).success).toBe(
      false,
    );
  });

  it("rejects unresolved gallery media and preserves contextual alt support", () => {
    const result = galleryItemContentSchema.safeParse({
      item: {
        id: "gallery-1",
        categoryId: "gallery-category-1",
        mediaAssetId: "different-media",
        altText: "A contextual description",
        displayOrder: 0,
        publishState: "PUBLISHED",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      media,
    });

    expect(result.success).toBe(false);
  });

  it("prevents draft dishes from crossing the public Menu boundary", () => {
    const result = publishedMenuContentSchema.safeParse({
      menu: {
        id: "menu-1",
        name: "Dinner",
        slug: "dinner",
        isPrimary: true,
        publishState: "PUBLISHED",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      categories: [
        {
          category: {
            id: "category-1",
            menuId: "menu-1",
            name: "Mains",
            slug: "mains",
            displayOrder: 0,
            isActive: true,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          dishes: [{ dish: { ...dish, publishState: "DRAFT" } }],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
