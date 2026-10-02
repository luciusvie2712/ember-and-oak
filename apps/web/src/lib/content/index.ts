import type { GalleryContentRepository } from "./gallery";
import type { HomeContentRepository } from "./home";
import type { MediaContentRepository } from "./media";
import type { MenuContentRepository } from "./menu";
import type { StoryContentRepository } from "./story";

export type ContentRepository = MenuContentRepository &
  StoryContentRepository &
  GalleryContentRepository &
  MediaContentRepository &
  HomeContentRepository;

let repository: ContentRepository | undefined;

export async function getContentRepository(): Promise<ContentRepository> {
  if (!repository) {
    const { HttpContentRepository } = await import("./http-content-repository");
    repository = new HttpContentRepository();
  }
  return repository;
}

export type { GalleryContentRepository, GalleryQuery } from "./gallery";
export type { HomeContentRepository } from "./home";
export type { MediaContentRepository } from "./media";
export type { MenuContentRepository } from "./menu";
export type { StoryContentRepository } from "./story";
