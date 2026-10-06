import { describe, expect, it } from "vitest";

import { operationalEditorialContentSchema, publicOperationsSchema } from "./operations.js";
import {
  privateDiningContentSchema,
  publishedPrivateDiningContentSchema,
} from "./private-dining.js";

const media = {
  id: "media-private",
  assetType: "IMAGE" as const,
  sourceUrl: "/images/private.webp",
  mimeType: "image/webp",
  width: 1200,
  height: 800,
  aspectRatio: 1.5,
  altText: "Private dining room",
  isDecorative: false,
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
};

const dining = {
  page: {
    id: "private-dining",
    slug: "private-dining",
    heroHeading: "Private Dining",
    heroDescription: "Gather around the table.",
    heroMediaId: media.id,
    enquiryHeading: "Plan your event",
    publishState: "PUBLISHED" as const,
  },
  heroMedia: media,
  experiences: [
    {
      experience: {
        id: "private-room",
        name: "Private Room",
        slug: "private-room",
        description: "An intimate setting.",
        capacityMin: 12,
        capacityMax: 20,
        capacityLabel: "12–20 guests",
        mediaId: media.id,
        displayOrder: 0,
        publishState: "PUBLISHED" as const,
      },
      media,
    },
  ],
};

const operations = {
  slug: "primary",
  location: {
    name: "Ember & Oak",
    addressLine1: "Test fixture street",
    city: "Ho Chi Minh City",
    countryCode: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  contact: {
    email: "fixture@example.invalid",
    phoneDisplay: "+84 90 123 4567",
    phoneE164: "+84901234567",
  },
  policies: [],
  publishState: "DRAFT" as const,
};

describe("Phase 10 editorial and operational contracts", () => {
  it("validates a published private dining page and matching media", () => {
    expect(publishedPrivateDiningContentSchema.safeParse(dining).success).toBe(true);
    expect(
      privateDiningContentSchema.safeParse({ ...dining, heroMedia: { ...media, id: "wrong" } })
        .success,
    ).toBe(false);
  });

  it("rejects invalid experience capacity and unpublished experiences", () => {
    expect(
      privateDiningContentSchema.safeParse({
        ...dining,
        experiences: [
          {
            ...dining.experiences[0],
            experience: { ...dining.experiences[0]!.experience, capacityMax: 2 },
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      publishedPrivateDiningContentSchema.safeParse({
        ...dining,
        experiences: [
          {
            ...dining.experiences[0],
            experience: { ...dining.experiences[0]!.experience, publishState: "DRAFT" },
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("requires canonical contact fields and excludes internal closure reasons", () => {
    expect(operationalEditorialContentSchema.safeParse(operations).success).toBe(true);
    expect(
      operationalEditorialContentSchema.safeParse({
        ...operations,
        contact: { ...operations.contact, phoneE164: "123" },
      }).success,
    ).toBe(false);
    const parsed = publicOperationsSchema.parse({
      location: operations.location,
      contact: operations.contact,
      openingHours: [{ dayOfWeek: 1, isClosed: true }],
      specialClosures: [{ date: "2026-12-24", type: "FULL_DAY", reason: "internal" }],
      policies: [],
    });
    expect(parsed.specialClosures[0]).not.toHaveProperty("reason");
  });
});
