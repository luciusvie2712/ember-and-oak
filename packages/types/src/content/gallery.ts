import type { MediaAsset } from "./media.js";
import type { ContentTimestamps, PublishState } from "./shared.js";

export type GalleryCategory = Readonly<{
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}>;

export type GalleryItem = Readonly<{
  id: string;
  categoryId: string;
  mediaAssetId: string;
  altText?: string | undefined;
  caption?: string | undefined;
  displayOrder: number;
  publishState: PublishState;
}> &
  ContentTimestamps;

export type GalleryItemContent = Readonly<{
  item: GalleryItem;
  media: MediaAsset;
}>;

export type GalleryCategoryContent = Readonly<{
  category: GalleryCategory;
  items: readonly GalleryItemContent[];
}>;

export type GalleryContent = Readonly<{
  categories: readonly GalleryCategoryContent[];
}>;
