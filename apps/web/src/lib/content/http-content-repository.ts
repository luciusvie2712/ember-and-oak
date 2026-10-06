import type {
  GalleryContent,
  HomeContent,
  MediaAsset,
  MenuContent,
  PrivateDiningContent,
  StoryContent,
} from "@ember-and-oak/types";
import {
  galleryContentSchema,
  homeContentSchema,
  mediaAssetSchema,
  menuContentSchema,
  privateDiningContentSchema,
  storyContentSchema,
  type ZodType,
} from "@ember-and-oak/validation";

import type { ContentRepository } from "./index";
import type { GalleryQuery } from "./gallery";

const DEFAULT_REVALIDATE_SECONDS = 300;

type ApiEnvelope = Readonly<{ data?: unknown }>;

export class ContentApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ContentApiError";
  }
}

function contentApiUrl(path: string): URL {
  const baseUrl = process.env.CONTENT_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new ContentApiError("CONTENT_API_URL is not configured");
  }
  return new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
}

async function fetchContent<T>(
  path: string,
  schema: ZodType<T>,
  tags: readonly string[],
): Promise<T | null> {
  const response = await fetch(contentApiUrl(path), {
    headers: { accept: "application/json" },
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: [...tags] },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ContentApiError(`Content API request failed for ${path}`, response.status);
  }

  const envelope = (await response.json()) as ApiEnvelope;
  return schema.parse(envelope.data);
}

export class HttpContentRepository implements ContentRepository {
  getPublishedMenu(slug: string): Promise<MenuContent | null> {
    return fetchContent(`api/v1/content/menu/${encodeURIComponent(slug)}`, menuContentSchema, [
      "menu",
      `menu:${slug}`,
    ]);
  }

  getPublishedStory(slug: string): Promise<StoryContent | null> {
    return fetchContent(`api/v1/content/story/${encodeURIComponent(slug)}`, storyContentSchema, [
      "story",
      `story:${slug}`,
      "chef",
    ]);
  }

  getPublishedGallery(query: GalleryQuery = {}): Promise<GalleryContent> {
    const search = new URLSearchParams();
    if (query.categorySlug) search.set("category", query.categorySlug);
    if (query.cursor) search.set("cursor", query.cursor);
    if (query.limit) search.set("limit", String(query.limit));
    const suffix = search.size > 0 ? `?${search.toString()}` : "";

    return fetchContent(`api/v1/content/gallery${suffix}`, galleryContentSchema, ["gallery"]).then(
      (content) => content ?? { categories: [] },
    );
  }

  getPublishedMediaAsset(id: string): Promise<MediaAsset | null> {
    return fetchContent(`api/v1/content/media/${encodeURIComponent(id)}`, mediaAssetSchema, [
      "media",
      `media:${id}`,
    ]);
  }

  getPublishedHome(slug = "home"): Promise<HomeContent | null> {
    return fetchContent(`api/v1/content/home/${encodeURIComponent(slug)}`, homeContentSchema, [
      "home",
      "menu",
      "chef",
    ]);
  }

  getPublishedPrivateDining(slug = "private-dining"): Promise<PrivateDiningContent | null> {
    return fetchContent(
      `api/v1/content/private-dining/${encodeURIComponent(slug)}`,
      privateDiningContentSchema,
      ["private-dining", `private-dining:${slug}`, "media"],
    );
  }
}
