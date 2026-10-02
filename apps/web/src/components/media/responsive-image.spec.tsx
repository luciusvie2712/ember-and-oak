import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ResponsiveImage } from "./responsive-image";

const asset = {
  id: "media-1",
  assetType: "IMAGE" as const,
  sourceUrl: "/images/home/atmosphere-fixture.webp",
  mimeType: "image/webp",
  width: 1600,
  height: 1067,
  aspectRatio: 1600 / 1067,
  altText: "Dining room during evening service",
  isDecorative: false,
  focalPointX: 0.25,
  focalPointY: 0.75,
  createdAt: "2026-10-02T12:00:00.000Z",
  updatedAt: "2026-10-02T12:00:00.000Z",
};

describe("ResponsiveImage", () => {
  it("reserves intrinsic space and lazy-loads non-critical media", () => {
    const markup = renderToStaticMarkup(
      <ResponsiveImage asset={asset} sizes="(max-width: 767px) 100vw, 50vw" />,
    );

    expect(markup).toContain('width="1600"');
    expect(markup).toContain('height="1067"');
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('alt="Dining room during evening service"');
    expect(markup).toContain("object-position:25% 75%");
  });

  it("uses an empty alt for explicitly decorative media", () => {
    const markup = renderToStaticMarkup(
      <ResponsiveImage asset={{ ...asset, isDecorative: true }} sizes="100vw" />,
    );
    expect(markup).toContain('alt=""');
  });
});
