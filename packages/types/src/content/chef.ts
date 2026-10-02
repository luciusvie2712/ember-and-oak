import type { MediaAsset } from "./media.js";
import type { PublishState } from "./shared.js";

export type ChefProfile = Readonly<{
  id: string;
  name: string;
  title: string;
  shortBio: string;
  fullBio?: string | undefined;
  philosophy?: string | undefined;
  quote?: string | undefined;
  portraitMediaId: string;
  secondaryMediaIds: readonly string[];
  signatureMediaId?: string | undefined;
  publishState: PublishState;
  updatedAt: string;
}>;

export type ChefProfileContent = Readonly<{
  chef: ChefProfile;
  portrait: MediaAsset;
  secondaryMedia: readonly MediaAsset[];
  signatureMedia?: MediaAsset | undefined;
}>;
