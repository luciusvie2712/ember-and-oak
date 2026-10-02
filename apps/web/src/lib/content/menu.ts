import type { MenuContent } from "@ember-and-oak/types";

export interface MenuContentRepository {
  getPublishedMenu(slug: string): Promise<MenuContent | null>;
}
