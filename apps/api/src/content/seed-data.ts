import type {
  ChefProfileContent,
  GalleryContent,
  HomeContent,
  MediaAsset,
  MenuContent,
  PrivateDiningContent,
  StoryContent,
} from '@ember-and-oak/types';

import type { ContentDocumentType } from './content-contract.js';

const timestamp = '2026-10-02T12:00:00.000Z';

function image(
  id: string,
  sourceUrl: string,
  altText: string,
  width = 1600,
  height = 1067,
): MediaAsset {
  return {
    id,
    assetType: 'IMAGE',
    sourceUrl,
    mimeType: 'image/webp',
    width,
    height,
    aspectRatio: width / height,
    altText,
    isDecorative: false,
    copyrightOwner: 'Ember & Oak',
    usageRights: 'Owned editorial asset',
    createdAt: timestamp,
    updatedAt: timestamp,
    publishedAt: timestamp,
  };
}

export const seedMedia = {
  hero: image(
    'media-hero-dish',
    '/images/home/hero-signature-dish-fixture.webp',
    'Fire-roasted seasonal vegetables served beside an open hearth',
  ),
  philosophy: image(
    'media-philosophy-fire',
    '/images/home/philosophy-fire-fixture.webp',
    'Chef tending vegetables over an open wood fire',
  ),
  atmosphere: image(
    'media-atmosphere',
    '/images/home/atmosphere-fixture.webp',
    'An intimate dining room during evening service',
  ),
  chef: image(
    'media-chef-portrait',
    '/images/home/chef-portrait-fixture.webp',
    'Executive Chef standing in the open-fire kitchen',
    1200,
    1600,
  ),
  tasting: image(
    'media-tasting',
    '/images/home/experience-tasting-fixture.webp',
    'A progression of seasonal tasting dishes',
  ),
  wine: image(
    'media-wine',
    '/images/home/experience-wine-fixture.webp',
    'Wine poured beside a seasonal plate',
  ),
  privateDining: image(
    'media-private-dining',
    '/images/home/experience-private-fixture.webp',
    'An intimate private dining room set for an evening gathering',
  ),
} as const;

const menuContent: MenuContent = {
  menu: {
    id: 'menu-dinner',
    name: 'Dinner',
    slug: 'dinner',
    description:
      'A season-led menu shaped by the hearth and our closest growers.',
    seasonLabel: 'Current menu',
    isPrimary: true,
    publishState: 'PUBLISHED',
    seo: {
      title: 'Dinner Menu',
      description: 'Explore the current season-led dinner menu at Ember & Oak.',
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    publishedAt: timestamp,
  },
  categories: [
    {
      category: {
        id: 'category-first',
        menuId: 'menu-dinner',
        name: 'First light',
        slug: 'first-light',
        description: 'Small beginnings from the garden and coast.',
        displayOrder: 0,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: timestamp,
      },
      dishes: [
        {
          dish: {
            id: 'dish-ember-roots',
            categoryId: 'category-first',
            name: 'Ember-roasted roots',
            slug: 'ember-roasted-roots',
            description: 'Cultured cream, garden herbs, warm spice.',
            priceAmount: 24,
            currencyCode: 'USD',
            primaryMediaId: seedMedia.hero.id,
            isAvailable: true,
            seasonalStatus: 'SEASONAL',
            isFeatured: true,
            displayOrder: 0,
            publishState: 'PUBLISHED',
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: timestamp,
          },
          primaryMedia: seedMedia.hero,
        },
        {
          dish: {
            id: 'dish-coastal-crudo',
            categoryId: 'category-first',
            name: 'Coastal crudo',
            slug: 'coastal-crudo',
            description: 'Citrus, smoked oil, young herbs.',
            priceAmount: 29,
            currencyCode: 'USD',
            primaryMediaId: seedMedia.tasting.id,
            isAvailable: true,
            seasonalStatus: 'LIMITED',
            isFeatured: false,
            displayOrder: 1,
            publishState: 'PUBLISHED',
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: timestamp,
          },
          primaryMedia: seedMedia.tasting,
        },
      ],
    },
    {
      category: {
        id: 'category-hearth',
        menuId: 'menu-dinner',
        name: 'From the hearth',
        slug: 'from-the-hearth',
        description:
          'Ingredients transformed with smoke, patience, and restraint.',
        displayOrder: 1,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: timestamp,
      },
      dishes: [
        {
          dish: {
            id: 'dish-coastal-catch',
            categoryId: 'category-hearth',
            name: 'Coastal catch',
            slug: 'coastal-catch',
            description: 'Charred alliums, shellfish broth, sea herbs.',
            priceAmount: 48,
            currencyCode: 'USD',
            primaryMediaId: seedMedia.tasting.id,
            isAvailable: true,
            seasonalStatus: 'CORE',
            isFeatured: true,
            displayOrder: 0,
            publishState: 'PUBLISHED',
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: timestamp,
          },
          primaryMedia: seedMedia.tasting,
        },
        {
          dish: {
            id: 'dish-aged-duck',
            categoryId: 'category-hearth',
            name: 'Dry-aged duck',
            slug: 'dry-aged-duck',
            description: 'Plum, bitter leaves, ember jus.',
            priceAmount: 56,
            currencyCode: 'USD',
            isAvailable: false,
            seasonalStatus: 'LIMITED',
            isFeatured: false,
            displayOrder: 1,
            publishState: 'PUBLISHED',
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: timestamp,
          },
        },
      ],
    },
    {
      category: {
        id: 'category-sweet',
        menuId: 'menu-dinner',
        name: 'A quiet finish',
        slug: 'a-quiet-finish',
        displayOrder: 2,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: timestamp,
      },
      dishes: [
        {
          dish: {
            id: 'dish-orchard-smoke',
            categoryId: 'category-sweet',
            name: 'Orchard & smoke',
            slug: 'orchard-and-smoke',
            description: 'Wood-fired fruit, toasted grain, botanical cream.',
            priceAmount: 18,
            currencyCode: 'USD',
            primaryMediaId: seedMedia.wine.id,
            isAvailable: true,
            seasonalStatus: 'SEASONAL',
            isFeatured: true,
            displayOrder: 0,
            publishState: 'PUBLISHED',
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: timestamp,
          },
          primaryMedia: seedMedia.wine,
        },
      ],
    },
  ],
};

const chefContent: ChefProfileContent = {
  chef: {
    id: 'chef-executive',
    name: 'Mara Ellison',
    title: 'Executive Chef',
    shortBio:
      'Mara cooks with the seasons, beginning with growers, fishers, and makers before bringing each ingredient to the hearth.',
    fullBio:
      'Her approach pairs careful sourcing with the instinctive energy of live fire, allowing every ingredient to retain its own voice.',
    philosophy: 'Fire should reveal an ingredient, never disguise it.',
    quote: 'Fire should reveal an ingredient, never disguise it.',
    portraitMediaId: seedMedia.chef.id,
    secondaryMediaIds: [seedMedia.philosophy.id],
    publishState: 'PUBLISHED',
    updatedAt: timestamp,
  },
  portrait: seedMedia.chef,
  secondaryMedia: [seedMedia.philosophy],
};

const storyContent: StoryContent = {
  story: {
    id: 'story-our-story',
    slug: 'our-story',
    introHeading:
      'A restaurant shaped by season, flame, and generous hospitality.',
    introBody:
      'Ember & Oak is an intimate dining room where ingredients lead and the hearth sets the rhythm.',
    originHeading: 'Where it began',
    originBody:
      'The idea began with a simple conviction: the most memorable meals feel rooted in a particular place and moment.',
    foundersHeading: 'A shared table',
    foundersBody:
      'Ember & Oak was founded by restaurant people who wanted precision without ceremony and warmth without compromise.',
    philosophyHeading: 'Ingredient first',
    philosophyBody:
      'We intervene only as much as an ingredient asks, using fire for character rather than spectacle.',
    sourcingHeading: 'Close to the source',
    sourcingBody:
      'Our menu follows ongoing conversations with growers, fishers, millers, and independent makers.',
    sustainabilityHeading: 'Use with care',
    sustainabilityBody:
      'Whole-product cooking, considered portions, and seasonal buying help us reduce waste by design.',
    designHeading: 'A room for the evening',
    designBody:
      'Natural oak, dark stone, and a view into the kitchen create a calm room that gathers energy as service unfolds.',
    chefProfileId: chefContent.chef.id,
    seo: {
      title: 'Our Story',
      description: 'The people and principles behind Ember & Oak.',
    },
    publishState: 'PUBLISHED',
    updatedAt: timestamp,
  },
  chef: chefContent,
  sectionMedia: [
    {
      relation: {
        storyPageId: 'story-our-story',
        sectionKey: 'ORIGIN',
        mediaAssetId: seedMedia.philosophy.id,
        displayOrder: 0,
      },
      media: seedMedia.philosophy,
    },
    {
      relation: {
        storyPageId: 'story-our-story',
        sectionKey: 'CHEF',
        mediaAssetId: seedMedia.chef.id,
        displayOrder: 0,
      },
      media: seedMedia.chef,
    },
    {
      relation: {
        storyPageId: 'story-our-story',
        sectionKey: 'DESIGN',
        mediaAssetId: seedMedia.atmosphere.id,
        displayOrder: 0,
      },
      media: seedMedia.atmosphere,
    },
  ],
};

const galleryCategoryNames = [
  ['food', 'Food', seedMedia.hero],
  ['chef', 'Chef', seedMedia.chef],
  ['ingredients', 'Ingredients', seedMedia.philosophy],
  ['kitchen', 'Kitchen', seedMedia.tasting],
  ['dining-room', 'Dining Room', seedMedia.atmosphere],
  ['wine', 'Wine', seedMedia.wine],
  ['guests', 'Guests', seedMedia.privateDining],
] as const;

const galleryContent: GalleryContent = {
  categories: galleryCategoryNames.map(([slug, name, media], index) => ({
    category: {
      id: `gallery-category-${slug}`,
      name,
      slug,
      displayOrder: index,
      isActive: true,
    },
    items: [
      {
        item: {
          id: `gallery-item-${slug}`,
          categoryId: `gallery-category-${slug}`,
          mediaAssetId: media.id,
          altText: media.altText,
          displayOrder: 0,
          publishState: 'PUBLISHED',
          createdAt: timestamp,
          updatedAt: timestamp,
          publishedAt: timestamp,
        },
        media,
      },
    ],
  })),
};

const homeContent: HomeContent = {
  home: {
    id: 'home-main',
    slug: 'home',
    heroEyebrow: 'Seasonal dining',
    heroHeading: 'Seasonal Dining, Refined.',
    heroDescription:
      'Contemporary cuisine inspired by local ingredients and open-fire cooking.',
    heroPrimaryMediaId: seedMedia.hero.id,
    philosophyLabel: 'Our philosophy',
    philosophyHeading: 'Simple ingredients. Unexpected experiences.',
    philosophyBody:
      'We cook with the seasons, choosing ingredients at their most expressive. Open fire brings warmth and texture with restraint.',
    philosophyMediaId: seedMedia.philosophy.id,
    atmosphereHeading: 'More than dinner. An evening to remember.',
    atmosphereMediaId: seedMedia.atmosphere.id,
    reservationHeading: 'Reserve your table.',
    reservationBody:
      'Join us for a season-led evening shaped by fire, craft, and thoughtful hospitality.',
    seo: {
      title: 'Ember & Oak',
      description:
        'Contemporary seasonal dining inspired by local ingredients and open fire.',
    },
    publishState: 'PUBLISHED',
    updatedAt: timestamp,
  },
  heroMedia: seedMedia.hero,
  philosophyMedia: seedMedia.philosophy,
  atmosphereMedia: seedMedia.atmosphere,
  featuredDishes: menuContent.categories.flatMap((entry) =>
    entry.dishes.filter((dish) => dish.dish.isFeatured),
  ),
  chef: chefContent,
  experiences: [
    {
      experience: {
        id: 'experience-tasting',
        title: 'Chef’s Tasting Menu',
        slug: 'tasting-menu',
        description:
          'A seasonal progression shaped by the day’s best ingredients.',
        mediaId: seedMedia.tasting.id,
        displayOrder: 0,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.tasting,
    },
    {
      experience: {
        id: 'experience-wine',
        title: 'Wine Pairing',
        slug: 'wine-pairing',
        description:
          'Thoughtful pours chosen to create contrast and resonance.',
        mediaId: seedMedia.wine.id,
        displayOrder: 1,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.wine,
    },
    {
      experience: {
        id: 'experience-private',
        title: 'Private Dining',
        slug: 'private-dining',
        description: 'An intimate setting for meaningful gatherings.',
        mediaId: seedMedia.privateDining.id,
        ctaLabel: 'Discover private dining',
        ctaTarget: '/private-dining',
        displayOrder: 2,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.privateDining,
    },
  ],
};

const privateDiningContent: PrivateDiningContent = {
  page: {
    id: 'private-dining-page',
    slug: 'private-dining',
    heroHeading: 'Private Dining',
    heroDescription:
      'A more personal way to gather around the Ember & Oak table.',
    heroMediaId: seedMedia.privateDining.id,
    introBody:
      'Make room for an evening shaped around your guests, the season, and the occasion.',
    enquiryHeading: 'Plan Your Event',
    enquiryBody:
      'Tell us what you have in mind. Our team will follow up about the possibilities.',
    seo: { title: 'Private Dining | Ember & Oak' },
    publishState: 'PUBLISHED',
  },
  heroMedia: seedMedia.privateDining,
  experiences: [
    {
      experience: {
        id: 'private-room',
        name: 'Private Room',
        slug: 'private-room',
        description:
          'A secluded setting for a gathering that feels entirely your own.',
        capacityMin: 12,
        capacityMax: 20,
        capacityLabel: '12–20 guests',
        mediaId: seedMedia.privateDining.id,
        displayOrder: 0,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.privateDining,
    },
    {
      experience: {
        id: 'chefs-table',
        name: "Chef's Table",
        slug: 'chefs-table',
        description:
          'An intimate view of the kitchen and the craft behind each course.',
        capacityMin: 6,
        capacityMax: 8,
        capacityLabel: '6–8 guests',
        mediaId: seedMedia.chef.id,
        displayOrder: 1,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.chef,
    },
    {
      experience: {
        id: 'full-buyout',
        name: 'Full Restaurant Buyout',
        slug: 'full-buyout',
        description:
          'The full dining room, ready for a remarkable shared evening.',
        capacityMax: 80,
        capacityLabel: 'Up to 80 guests',
        mediaId: seedMedia.atmosphere.id,
        displayOrder: 2,
        publishState: 'PUBLISHED',
      },
      media: seedMedia.atmosphere,
    },
  ],
};

export const seedDocuments: readonly Readonly<{
  type: ContentDocumentType;
  slug: string;
  content: unknown;
}>[] = [
  ...Object.values(seedMedia).map((content) => ({
    type: 'media' as const,
    slug: content.id,
    content,
  })),
  { type: 'chef', slug: 'executive-chef', content: chefContent },
  { type: 'menu', slug: 'dinner', content: menuContent },
  { type: 'story', slug: 'our-story', content: storyContent },
  { type: 'gallery', slug: 'gallery', content: galleryContent },
  { type: 'home', slug: 'home', content: homeContent },
  {
    type: 'private-dining',
    slug: 'private-dining',
    content: privateDiningContent,
  },
];
