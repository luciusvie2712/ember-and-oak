export const PUBLISH_STATES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export type PublishState = (typeof PUBLISH_STATES)[number];

export type SeoMetadata = Readonly<{
  title?: string | undefined;
  description?: string | undefined;
  canonicalPath?: string | undefined;
  socialImageId?: string | undefined;
  noIndex?: boolean | undefined;
}>;

export type ContentTimestamps = Readonly<{
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | undefined;
}>;
