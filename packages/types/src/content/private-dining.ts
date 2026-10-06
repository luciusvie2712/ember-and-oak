import type { MediaAsset } from "./media.js";
import type { PublishState, SeoMetadata } from "./shared.js";

export type PrivateDiningExperience = Readonly<{
  id: string;
  name: string;
  slug: string;
  description: string;
  capacityMin?: number | undefined;
  capacityMax?: number | undefined;
  capacityLabel: string;
  mediaId: string;
  displayOrder: number;
  publishState: PublishState;
}>;

export type PrivateDiningPage = Readonly<{
  id: string;
  slug: string;
  heroHeading: string;
  heroDescription: string;
  heroMediaId: string;
  introBody?: string | undefined;
  enquiryHeading: string;
  enquiryBody?: string | undefined;
  seo?: SeoMetadata | undefined;
  publishState: PublishState;
}>;

export type PrivateDiningContent = Readonly<{
  page: PrivateDiningPage;
  heroMedia: MediaAsset;
  experiences: readonly Readonly<{
    experience: PrivateDiningExperience;
    media: MediaAsset;
  }>[];
}>;
