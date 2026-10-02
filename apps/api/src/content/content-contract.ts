import {
  chefProfileContentSchema,
  galleryContentSchema,
  homeContentSchema,
  mediaAssetSchema,
  menuContentSchema,
  publishedChefProfileContentSchema,
  publishedGalleryContentSchema,
  publishedHomeContentSchema,
  publishedMenuContentSchema,
  publishedStoryContentSchema,
  storyContentSchema,
  z,
} from '@ember-and-oak/validation';

export const contentDocumentTypeSchema = z.enum([
  'menu',
  'story',
  'gallery',
  'home',
  'chef',
  'media',
]);

export type ContentDocumentType = z.infer<typeof contentDocumentTypeSchema>;

export const draftSchemas = {
  menu: menuContentSchema,
  story: storyContentSchema,
  gallery: galleryContentSchema,
  home: homeContentSchema,
  chef: chefProfileContentSchema,
  media: mediaAssetSchema,
} as const;

export const publishedSchemas = {
  menu: publishedMenuContentSchema,
  story: publishedStoryContentSchema,
  gallery: publishedGalleryContentSchema,
  home: publishedHomeContentSchema,
  chef: publishedChefProfileContentSchema,
  media: mediaAssetSchema,
} as const;

export function invalidationTargets(type: ContentDocumentType, slug: string) {
  switch (type) {
    case 'menu':
      return { tags: ['menu', `menu:${slug}`, 'home'], paths: ['/menu', '/'] };
    case 'story':
      return { tags: ['story', `story:${slug}`], paths: ['/our-story'] };
    case 'chef':
      return {
        tags: ['chef', 'story', 'home'],
        paths: ['/our-story', '/'],
      };
    case 'gallery':
      return { tags: ['gallery'], paths: ['/gallery'] };
    case 'home':
      return { tags: ['home'], paths: ['/'] };
    case 'media':
      return {
        tags: ['media', `media:${slug}`, 'menu', 'story', 'gallery', 'home'],
        paths: ['/menu', '/our-story', '/gallery', '/'],
      };
  }
}
