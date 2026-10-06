import type { PublishState } from "./shared.js";

export type PublicRestaurantLocation = Readonly<{
  name: string;
  addressLine1: string;
  addressLine2?: string | undefined;
  wardOrDistrict?: string | undefined;
  city: string;
  region?: string | undefined;
  postalCode?: string | undefined;
  countryCode: string;
  timezone: string;
  directionsUrl?: string | undefined;
}>;

export type PublicContactInformation = Readonly<{
  email: string;
  phoneDisplay: string;
  phoneE164: string;
  instagramUrl?: string | undefined;
  facebookUrl?: string | undefined;
}>;

export type PublicOpeningHours = Readonly<{
  dayOfWeek: number;
  openTime?: string | undefined;
  closeTime?: string | undefined;
  isClosed: boolean;
}>;

export type PublicSpecialClosure = Readonly<{
  date: string;
  type: "FULL_DAY" | "PARTIAL_DAY";
  startTime?: string | undefined;
  endTime?: string | undefined;
  publicMessage?: string | undefined;
}>;

export type PublicPolicy = Readonly<{
  type: "DRESS_CODE" | "RESERVATION" | "CANCELLATION" | "PRIVACY" | "TERMS";
  title: string;
  body: string;
}>;

export type EditorialPolicy = PublicPolicy & Readonly<{ publishState: PublishState }>;

export type OperationalEditorialContent = Readonly<{
  slug: string;
  location: PublicRestaurantLocation;
  contact: PublicContactInformation;
  policies: readonly EditorialPolicy[];
  publishState: PublishState;
}>;

export type PublicOperations = Readonly<{
  location: PublicRestaurantLocation;
  contact: PublicContactInformation;
  openingHours: readonly PublicOpeningHours[];
  specialClosures: readonly PublicSpecialClosure[];
  policies: readonly PublicPolicy[];
}>;
