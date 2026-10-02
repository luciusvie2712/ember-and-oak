import type { HomeContent } from "@ember-and-oak/types";

export interface HomeContentRepository {
  getPublishedHome(slug?: string): Promise<HomeContent | null>;
}
