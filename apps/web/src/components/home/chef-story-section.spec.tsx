import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChefStorySection } from "./chef-story-section";

const content = {
  chef: {
    id: "chef-1",
    title: "Executive Chef",
    name: "A deliberately very long chef name for layout stress testing",
    shortBio: "A seasonal story.",
    quote:
      "A deliberately long quote that tests whether the editorial composition can grow without breaking its media alignment.",
    portraitMediaId: "portrait-1",
    secondaryMediaIds: [],
    publishState: "PUBLISHED" as const,
    updatedAt: "2026-10-02T12:00:00.000Z",
  },
  portrait: {
    id: "portrait-1",
    assetType: "IMAGE" as const,
    sourceUrl: "/images/home/chef-portrait-fixture.webp",
    mimeType: "image/webp",
    width: 1200,
    height: 1600,
    aspectRatio: 0.75,
    altText: "Executive Chef in the kitchen",
    isDecorative: false,
    createdAt: "2026-10-02T12:00:00.000Z",
    updatedAt: "2026-10-02T12:00:00.000Z",
  },
  secondaryMedia: [],
} as const;

describe("ChefStorySection", () => {
  it("renders canonical chef content and portrait media", () => {
    const markup = renderToStaticMarkup(<ChefStorySection content={content} />);
    expect(markup).toContain(content.chef.name);
    expect(markup).toContain(content.chef.quote);
    expect(markup).toContain("<img");
  });
});
