import type { GalleryContent } from "@ember-and-oak/types";

export type GalleryQuery = Readonly<{
  categorySlug?: string;
  cursor?: string;
  limit?: number;
}>;

export interface GalleryContentRepository {
  getPublishedGallery(query?: GalleryQuery): Promise<GalleryContent>;
}
