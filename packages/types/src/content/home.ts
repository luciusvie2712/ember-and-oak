import type { ChefProfileContent } from "./chef.js";
import type { MediaAsset } from "./media.js";
import type { MenuDishContent } from "./menu.js";
import type { PublishState, SeoMetadata } from "./shared.js";

export type HomePage = Readonly<{
  id: string;
  slug: string;
  heroEyebrow?: string | undefined;
  heroHeading: string;
  heroDescription: string;
  heroPrimaryMediaId: string;
  philosophyLabel: string;
  philosophyHeading: string;
  philosophyBody: string;
  philosophyMediaId?: string | undefined;
  atmosphereHeading: string;
  atmosphereBody?: string | undefined;
  atmosphereMediaId: string;
  reservationHeading: string;
  reservationBody?: string | undefined;
  seo?: SeoMetadata | undefined;
  publishState: PublishState;
  updatedAt: string;
}>;

export type DiningExperience = Readonly<{
  id: string;
  title: string;
  slug: string;
  description: string;
  priceLabel?: string | undefined;
  mediaId: string;
  ctaLabel?: string | undefined;
  ctaTarget?: string | undefined;
  displayOrder: number;
  publishState: PublishState;
}>;

export type DiningExperienceContent = Readonly<{
  experience: DiningExperience;
  media: MediaAsset;
}>;

export type HomeContent = Readonly<{
  home: HomePage;
  heroMedia: MediaAsset;
  philosophyMedia?: MediaAsset | undefined;
  atmosphereMedia: MediaAsset;
  featuredDishes: readonly MenuDishContent[];
  chef: ChefProfileContent;
  experiences: readonly DiningExperienceContent[];
}>;
