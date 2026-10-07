import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  GalleryContent,
  HomeContent,
  MediaAsset,
  MenuContent,
  OperationalEditorialContent,
  PrivateDiningContent,
  StoryContent,
} from '@ember-and-oak/types';
import {
  chefProfileContentSchema,
  galleryContentSchema,
  homeContentSchema,
  mediaAssetSchema,
  menuContentSchema,
  operationalEditorialContentSchema,
  privateDiningContentSchema,
  publishedGalleryContentSchema,
  publishedHomeContentSchema,
  publishedMenuContentSchema,
  publishedOperationalEditorialContentSchema,
  publishedPrivateDiningContentSchema,
  publishedStoryContentSchema,
  storyContentSchema,
} from '@ember-and-oak/validation';

import { ContentDatabaseService } from '../database/content-database.service.js';
import {
  contentDocumentTypeSchema,
  draftSchemas,
  invalidationTargets,
  publishedSchemas,
  type ContentDocumentType,
} from './content-contract.js';
import { ContentRevalidationService } from './content-revalidation.service.js';

type DocumentRow = Readonly<{
  document_type: ContentDocumentType;
  slug: string;
  draft_revision: unknown | null;
  published_revision: unknown | null;
  publish_state: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  updated_at: Date;
  published_at: Date | null;
}>;

function byDisplayOrder<T extends { displayOrder: number }>(left: T, right: T) {
  return left.displayOrder - right.displayOrder;
}

@Injectable()
export class ContentService {
  constructor(
    private readonly database: ContentDatabaseService,
    private readonly revalidation: ContentRevalidationService,
  ) {}

  private async getPublishedRaw(
    type: ContentDocumentType,
    slug: string,
  ): Promise<unknown | null> {
    const result = await this.database.query<DocumentRow>(
      `SELECT document_type, slug, draft_revision, published_revision,
              publish_state, version, updated_at, published_at
       FROM content_documents
       WHERE document_type = $1 AND slug = $2
         AND publish_state = 'PUBLISHED' AND published_revision IS NOT NULL`,
      [type, slug],
    );
    return result.rows[0]?.published_revision ?? null;
  }

  private async getPublishedRows(
    type: ContentDocumentType,
  ): Promise<DocumentRow[]> {
    const result = await this.database.query<DocumentRow>(
      `SELECT document_type, slug, draft_revision, published_revision,
              publish_state, version, updated_at, published_at
       FROM content_documents
       WHERE document_type = $1
         AND publish_state = 'PUBLISHED' AND published_revision IS NOT NULL
       ORDER BY slug`,
      [type],
    );
    return result.rows;
  }

  private async mediaMap(): Promise<Map<string, MediaAsset>> {
    const rows = await this.getPublishedRows('media');
    return new Map(
      rows.map((row) => {
        const asset = mediaAssetSchema.parse(row.published_revision);
        return [asset.id, asset];
      }),
    );
  }

  private async getChefById(id: string, media: Map<string, MediaAsset>) {
    const rows = await this.getPublishedRows('chef');
    const stored = rows
      .map((row) => chefProfileContentSchema.parse(row.published_revision))
      .find((entry) => entry.chef.id === id);
    if (!stored) return null;

    return chefProfileContentSchema.parse({
      ...stored,
      portrait: media.get(stored.chef.portraitMediaId) ?? stored.portrait,
      secondaryMedia: stored.chef.secondaryMediaIds.map(
        (mediaId, index) => media.get(mediaId) ?? stored.secondaryMedia[index],
      ),
      signatureMedia: stored.chef.signatureMediaId
        ? (media.get(stored.chef.signatureMediaId) ?? stored.signatureMedia)
        : undefined,
    });
  }

  async getMenu(slug: string): Promise<MenuContent | null> {
    const raw = await this.getPublishedRaw('menu', slug);
    if (!raw) return null;
    const stored = menuContentSchema.parse(raw);
    const media = await this.mediaMap();

    return publishedMenuContentSchema.parse({
      ...stored,
      categories: [...stored.categories]
        .sort((left, right) => byDisplayOrder(left.category, right.category))
        .map((entry) => ({
          ...entry,
          dishes: [...entry.dishes]
            .sort((left, right) => byDisplayOrder(left.dish, right.dish))
            .map((dishEntry) => ({
              ...dishEntry,
              primaryMedia: dishEntry.dish.primaryMediaId
                ? (media.get(dishEntry.dish.primaryMediaId) ??
                  dishEntry.primaryMedia)
                : undefined,
            })),
        })),
    });
  }

  async getStory(slug: string): Promise<StoryContent | null> {
    const raw = await this.getPublishedRaw('story', slug);
    if (!raw) return null;
    const stored = storyContentSchema.parse(raw);
    const media = await this.mediaMap();
    const chef = await this.getChefById(stored.story.chefProfileId, media);
    if (!chef)
      throw new NotFoundException('Published Story chef was not found');

    return publishedStoryContentSchema.parse({
      ...stored,
      chef,
      sectionMedia: [...stored.sectionMedia]
        .sort((left, right) => byDisplayOrder(left.relation, right.relation))
        .map((entry) => ({
          ...entry,
          media: media.get(entry.relation.mediaAssetId) ?? entry.media,
        })),
    });
  }

  async getGallery(categorySlug?: string): Promise<GalleryContent | null> {
    const raw = await this.getPublishedRaw('gallery', 'gallery');
    if (!raw) return null;
    const stored = galleryContentSchema.parse(raw);
    const media = await this.mediaMap();
    const categories = [...stored.categories]
      .filter((entry) => !categorySlug || entry.category.slug === categorySlug)
      .sort((left, right) => byDisplayOrder(left.category, right.category))
      .map((entry) => ({
        ...entry,
        items: [...entry.items]
          .sort((left, right) => byDisplayOrder(left.item, right.item))
          .map((item) => ({
            ...item,
            media: media.get(item.item.mediaAssetId) ?? item.media,
          })),
      }));

    return publishedGalleryContentSchema.parse({ categories });
  }

  async getHome(slug: string): Promise<HomeContent | null> {
    const raw = await this.getPublishedRaw('home', slug);
    if (!raw) return null;
    const stored = homeContentSchema.parse(raw);
    const media = await this.mediaMap();
    const chef = await this.getChefById(stored.chef.chef.id, media);
    if (!chef) throw new NotFoundException('Published Home chef was not found');

    const menuRows = await this.getPublishedRows('menu');
    const menu = menuRows
      .map((row) => menuContentSchema.parse(row.published_revision))
      .find((entry) => entry.menu.isPrimary);
    const featuredDishes =
      menu?.categories.flatMap((entry) =>
        entry.dishes
          .filter((dishEntry) => dishEntry.dish.isFeatured)
          .map((dishEntry) => ({
            ...dishEntry,
            primaryMedia: dishEntry.dish.primaryMediaId
              ? (media.get(dishEntry.dish.primaryMediaId) ??
                dishEntry.primaryMedia)
              : undefined,
          })),
      ) ?? [];

    return publishedHomeContentSchema.parse({
      ...stored,
      heroMedia: media.get(stored.home.heroPrimaryMediaId) ?? stored.heroMedia,
      philosophyMedia: stored.home.philosophyMediaId
        ? (media.get(stored.home.philosophyMediaId) ?? stored.philosophyMedia)
        : undefined,
      atmosphereMedia:
        media.get(stored.home.atmosphereMediaId) ?? stored.atmosphereMedia,
      featuredDishes,
      chef,
      experiences: [...stored.experiences]
        .sort((left, right) =>
          byDisplayOrder(left.experience, right.experience),
        )
        .map((entry) => ({
          ...entry,
          media: media.get(entry.experience.mediaId) ?? entry.media,
        })),
    });
  }

  async getMedia(id: string): Promise<MediaAsset | null> {
    const raw = await this.getPublishedRaw('media', id);
    return raw ? mediaAssetSchema.parse(raw) : null;
  }

  async getPrivateDining(slug: string): Promise<PrivateDiningContent | null> {
    const raw = await this.getPublishedRaw('private-dining', slug);
    if (!raw) return null;
    const stored = privateDiningContentSchema.parse(raw);
    const media = await this.mediaMap();
    const heroMedia = media.get(stored.page.heroMediaId);
    if (!heroMedia)
      throw new NotFoundException(
        'Published Private Dining hero media was not found',
      );
    const experiences = [...stored.experiences]
      .sort((left, right) => byDisplayOrder(left.experience, right.experience))
      .map((entry) => {
        const resolved = media.get(entry.experience.mediaId);
        if (!resolved)
          throw new NotFoundException(
            'Published Private Dining media was not found',
          );
        return { experience: entry.experience, media: resolved };
      });
    return publishedPrivateDiningContentSchema.parse({
      page: stored.page,
      heroMedia,
      experiences,
    });
  }

  async getOperations(
    slug = 'primary',
  ): Promise<OperationalEditorialContent | null> {
    const raw = await this.getPublishedRaw('operations', slug);
    if (!raw) return null;
    return publishedOperationalEditorialContentSchema.parse(
      operationalEditorialContentSchema.parse(raw),
    );
  }

  async getAdminDocument(typeValue: string, slug: string) {
    const type = contentDocumentTypeSchema.parse(typeValue);
    const result = await this.database.query<DocumentRow>(
      `SELECT document_type, slug, draft_revision, published_revision,
              publish_state, version, updated_at, published_at
       FROM content_documents
       WHERE document_type = $1 AND slug = $2`,
      [type, slug],
    );
    const row = result.rows[0];
    if (!row) throw new NotFoundException('Content document was not found');
    return {
      type: row.document_type,
      slug: row.slug,
      draft: row.draft_revision,
      published: row.published_revision,
      publishState: row.publish_state,
      version: row.version,
      updatedAt: row.updated_at.toISOString(),
      publishedAt: row.published_at?.toISOString(),
    };
  }

  async listAdminDocuments(typeValue: string) {
    const type = contentDocumentTypeSchema.parse(typeValue);
    const result = await this.database.query<DocumentRow>(
      `SELECT document_type, slug, draft_revision, published_revision,
              publish_state, version, updated_at, published_at
       FROM content_documents WHERE document_type = $1 ORDER BY slug`,
      [type],
    );
    return result.rows.map((row) => ({
      type: row.document_type,
      slug: row.slug,
      draft: row.draft_revision,
      published: row.published_revision,
      publishState: row.publish_state,
      version: row.version,
      updatedAt: row.updated_at.toISOString(),
      publishedAt: row.published_at?.toISOString(),
    }));
  }

  async saveDraft(typeValue: string, slug: string, input: unknown) {
    const type = contentDocumentTypeSchema.parse(typeValue);
    const envelope =
      input && typeof input === 'object' && 'content' in input
        ? (input as { content: unknown; expectedVersion?: unknown })
        : { content: input, expectedVersion: undefined };
    const canonical = draftSchemas[type].parse(envelope.content);
    const expectedVersion =
      typeof envelope.expectedVersion === 'number'
        ? envelope.expectedVersion
        : undefined;
    const result = await this.database.query<DocumentRow>(
      `INSERT INTO content_documents (document_type, slug, draft_revision, publish_state, version)
       VALUES ($1, $2, $3::jsonb, 'DRAFT', 1)
       ON CONFLICT (document_type, slug) DO UPDATE
       SET draft_revision = EXCLUDED.draft_revision,
           version = content_documents.version + 1,
           updated_at = now()
       WHERE $4::integer IS NULL OR content_documents.version = $4
       RETURNING document_type, slug, draft_revision, published_revision,
                 publish_state, version, updated_at, published_at`,
      [type, slug, JSON.stringify(canonical), expectedVersion ?? null],
    );
    if (!result.rowCount)
      throw new ConflictException('CONTENT_VERSION_CONFLICT');
    return {
      type,
      slug,
      version: result.rows[0]?.version ?? 1,
      validated: true,
    };
  }

  async publish(typeValue: string, slug: string) {
    const type = contentDocumentTypeSchema.parse(typeValue);
    const view = await this.getAdminDocument(type, slug);
    const canonical = publishedSchemas[type].parse(view.draft);
    const targets = invalidationTargets(type, slug);

    const result = await this.database.transaction(async (client) => {
      const published = await client.query<DocumentRow>(
        `UPDATE content_documents
         SET published_revision = $3::jsonb,
             publish_state = 'PUBLISHED', published_at = now(), updated_at = now()
         WHERE document_type = $1 AND slug = $2
         RETURNING document_type, slug, draft_revision, published_revision,
                   publish_state, version, updated_at, published_at`,
        [type, slug, JSON.stringify(canonical)],
      );
      if (!published.rowCount)
        throw new NotFoundException('Content document was not found');

      await client.query(
        `INSERT INTO content_publish_outbox
           (document_type, document_slug, tags, paths)
         VALUES ($1, $2, $3::jsonb, $4::jsonb)`,
        [
          type,
          slug,
          JSON.stringify(targets.tags),
          JSON.stringify(targets.paths),
        ],
      );
      return published.rows[0];
    });

    await this.revalidation.flushPending();
    return {
      type,
      slug,
      version: result?.version,
      publishedAt: result?.published_at?.toISOString(),
      invalidation: targets,
    };
  }

  async archive(typeValue: string, slug: string) {
    const type = contentDocumentTypeSchema.parse(typeValue);
    const targets = invalidationTargets(type, slug);

    const result = await this.database.transaction(async (client) => {
      const archived = await client.query<DocumentRow>(
        `UPDATE content_documents
         SET publish_state = 'ARCHIVED', updated_at = now()
         WHERE document_type = $1 AND slug = $2
         RETURNING document_type, slug, draft_revision, published_revision,
                   publish_state, version, updated_at, published_at`,
        [type, slug],
      );
      if (!archived.rowCount)
        throw new NotFoundException('Content document was not found');

      await client.query(
        `INSERT INTO content_publish_outbox
           (document_type, document_slug, tags, paths)
         VALUES ($1, $2, $3::jsonb, $4::jsonb)`,
        [
          type,
          slug,
          JSON.stringify(targets.tags),
          JSON.stringify(targets.paths),
        ],
      );
      return archived.rows[0];
    });

    await this.revalidation.flushPending();
    return {
      type,
      slug,
      version: result?.version,
      archived: true,
      invalidation: targets,
    };
  }
}
