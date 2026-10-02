import type { MediaAsset } from "./media.js";
import type { ContentTimestamps, PublishState, SeoMetadata } from "./shared.js";

export const SEASONAL_STATUSES = ["CORE", "SEASONAL", "LIMITED"] as const;

export type SeasonalStatus = (typeof SEASONAL_STATUSES)[number];

export type Menu = Readonly<{
  id: string;
  name: string;
  slug: string;
  description?: string | undefined;
  seasonLabel?: string | undefined;
  validFrom?: string | undefined;
  validTo?: string | undefined;
  isPrimary: boolean;
  publishState: PublishState;
  seo?: SeoMetadata | undefined;
}> &
  ContentTimestamps;

export type MenuCategory = Readonly<{
  id: string;
  menuId: string;
  name: string;
  slug: string;
  description?: string | undefined;
  displayOrder: number;
  isActive: boolean;
}> &
  ContentTimestamps;

export type Dish = Readonly<{
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  priceAmount: number;
  currencyCode: string;
  primaryMediaId?: string | undefined;
  isAvailable: boolean;
  seasonalStatus: SeasonalStatus;
  isFeatured: boolean;
  displayOrder: number;
  publishState: PublishState;
}> &
  ContentTimestamps;

export type MenuDishContent = Readonly<{
  dish: Dish;
  primaryMedia?: MediaAsset | undefined;
}>;

export type MenuCategoryContent = Readonly<{
  category: MenuCategory;
  dishes: readonly MenuDishContent[];
}>;

export type MenuContent = Readonly<{
  menu: Menu;
  categories: readonly MenuCategoryContent[];
}>;
