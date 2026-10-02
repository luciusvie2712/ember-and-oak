import type { ContentTimestamps } from "./shared.js";

export const MEDIA_ASSET_TYPES = ["IMAGE", "VIDEO"] as const;

export type MediaAssetType = (typeof MEDIA_ASSET_TYPES)[number];

export type MediaAsset = Readonly<{
  id: string;
  assetType: MediaAssetType;
  sourceUrl: string;
  storageKey?: string | undefined;
  mimeType: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSizeBytes?: number | undefined;
  altText?: string | undefined;
  isDecorative: boolean;
  caption?: string | undefined;
  focalPointX?: number | undefined;
  focalPointY?: number | undefined;
  credit?: string | undefined;
  copyrightOwner?: string | undefined;
  usageRights?: string | undefined;
}> &
  ContentTimestamps;
