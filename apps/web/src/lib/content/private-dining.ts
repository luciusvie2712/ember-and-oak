import type { PrivateDiningContent } from "@ember-and-oak/types";

export interface PrivateDiningContentRepository {
  getPublishedPrivateDining(slug?: string): Promise<PrivateDiningContent | null>;
}
