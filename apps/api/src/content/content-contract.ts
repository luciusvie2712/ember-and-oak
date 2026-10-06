import {
  chefProfileContentSchema,
  galleryContentSchema,
  homeContentSchema,
  mediaAssetSchema,
  menuContentSchema,
  operationalEditorialContentSchema,
  privateDiningContentSchema,
  publishedChefProfileContentSchema,
  publishedGalleryContentSchema,
  publishedHomeContentSchema,
  publishedMenuContentSchema,
  publishedOperationalEditorialContentSchema,
  publishedPrivateDiningContentSchema,
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
  'private-dining',
  'operations',
]);

export type ContentDocumentType = z.infer<typeof contentDocumentTypeSchema>;

export const draftSchemas = {
  menu: menuContentSchema,
  story: storyContentSchema,
  gallery: galleryContentSchema,
  home: homeContentSchema,
  chef: chefProfileContentSchema,
  media: mediaAssetSchema,
  'private-dining': privateDiningContentSchema,
  operations: operationalEditorialContentSchema,
} as const;

export const publishedSchemas = {
  menu: publishedMenuContentSchema,
  story: publishedStoryContentSchema,
  gallery: publishedGalleryContentSchema,
  home: publishedHomeContentSchema,
  chef: publishedChefProfileContentSchema,
  media: mediaAssetSchema,
  'private-dining': publishedPrivateDiningContentSchema,
  operations: publishedOperationalEditorialContentSchema,
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
    case 'private-dining':
      return {
        tags: ['private-dining', `private-dining:${slug}`],
        paths: ['/private-dining'],
      };
    case 'operations':
      return {
        tags: ['operations'],
        paths: ['/', '/contact', '/reservations', '/private-dining'],
      };
    case 'media':
      return {
        tags: [
          'media',
          `media:${slug}`,
          'menu',
          'story',
          'gallery',
          'home',
          'private-dining',
        ],
        paths: ['/menu', '/our-story', '/gallery', '/', '/private-dining'],
      };
  }
}
