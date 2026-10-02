import type { ChefProfileContent } from "./chef.js";
import type { MediaAsset } from "./media.js";
import type { PublishState, SeoMetadata } from "./shared.js";

export const STORY_SECTION_KEYS = [
  "INTRO",
  "ORIGIN",
  "FOUNDERS",
  "CHEF",
  "PHILOSOPHY",
  "SOURCING",
  "SUSTAINABILITY",
  "DESIGN",
] as const;

export type StorySectionKey = (typeof STORY_SECTION_KEYS)[number];

export type StoryPage = Readonly<{
  id: string;
  slug: string;
  introHeading: string;
  introBody?: string | undefined;
  originHeading: string;
  originBody: string;
  foundersHeading?: string | undefined;
  foundersBody?: string | undefined;
  philosophyHeading: string;
  philosophyBody: string;
  sourcingHeading: string;
  sourcingBody: string;
  sustainabilityHeading: string;
  sustainabilityBody: string;
  designHeading: string;
  designBody: string;
  chefProfileId: string;
  seo?: SeoMetadata | undefined;
  publishState: PublishState;
  updatedAt: string;
}>;

export type StorySectionMedia = Readonly<{
  storyPageId: string;
  sectionKey: StorySectionKey;
  mediaAssetId: string;
  displayOrder: number;
}>;

export type StoryMediaContent = Readonly<{
  relation: StorySectionMedia;
  media: MediaAsset;
}>;

export type StoryContent = Readonly<{
  story: StoryPage;
  chef: ChefProfileContent;
  sectionMedia: readonly StoryMediaContent[];
}>;
