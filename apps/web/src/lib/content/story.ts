import type { StoryContent } from "@ember-and-oak/types";

export interface StoryContentRepository {
  getPublishedStory(slug: string): Promise<StoryContent | null>;
}
