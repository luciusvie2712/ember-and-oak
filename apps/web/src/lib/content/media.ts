import type { MediaAsset } from "@ember-and-oak/types";

export interface MediaContentRepository {
  getPublishedMediaAsset(id: string): Promise<MediaAsset | null>;
}
