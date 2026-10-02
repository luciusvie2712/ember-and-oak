import 'dotenv/config';

import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { configureHttpApplication } from '../src/http/configure-http.js';

const apiKey = 'phase7_integration_content_key_123456';
const menuSlug = 'phase7-integration-menu';
const storySlug = 'phase7-integration-story';

describe('Phase 7 content lifecycle (e2e)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  let testStartedAt: Date;

  beforeAll(async () => {
    testStartedAt = new Date();
    process.env.ADMIN_CONTENT_API_KEY = apiKey;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureHttpApplication(app);
    await app.init();
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  });

  it('keeps a validated draft private until an authorized publish', async () => {
    const liveMenu = await request(app.getHttpServer())
      .get('/api/v1/content/menu/dinner')
      .expect(200);
    const draft = structuredClone(liveMenu.body.data);
    draft.menu = {
      ...draft.menu,
      id: 'menu-phase7-integration',
      slug: menuSlug,
      description: 'Changed by an editor without an application rebuild.',
    };
    draft.categories = draft.categories.map(
      (entry: { category: Record<string, unknown> }) => ({
        ...entry,
        category: { ...entry.category, menuId: 'menu-phase7-integration' },
      }),
    );

    await request(app.getHttpServer())
      .put(`/api/v1/admin/content/menu/${menuSlug}/draft`)
      .send(draft)
      .expect(401);

    await request(app.getHttpServer())
      .put(`/api/v1/admin/content/menu/${menuSlug}/draft`)
      .set('x-content-api-key', apiKey)
      .send(draft)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/v1/content/menu/${menuSlug}`)
      .expect(404);

    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/menu/${menuSlug}/publish`)
      .set('x-content-api-key', apiKey)
      .send({})
      .expect(201);

    const published = await request(app.getHttpServer())
      .get(`/api/v1/content/menu/${menuSlug}`)
      .expect(200);
    expect(published.body.data.menu.description).toBe(
      'Changed by an editor without an application rebuild.',
    );

    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/menu/${menuSlug}/archive`)
      .set('x-content-api-key', apiKey)
      .send({})
      .expect(201);
    await request(app.getHttpServer())
      .get(`/api/v1/content/menu/${menuSlug}`)
      .expect(404);
  });

  it('publishes Story changes without exposing the draft first', async () => {
    const liveStory = await request(app.getHttpServer())
      .get('/api/v1/content/story/our-story')
      .expect(200);
    const draft = structuredClone(liveStory.body.data);
    draft.story = {
      ...draft.story,
      id: 'story-phase7-integration',
      slug: storySlug,
      originBody:
        'An editor-updated origin published without rebuilding the application.',
    };
    draft.sectionMedia = draft.sectionMedia.map(
      (entry: { relation: Record<string, unknown> }) => ({
        ...entry,
        relation: {
          ...entry.relation,
          storyPageId: 'story-phase7-integration',
        },
      }),
    );

    await request(app.getHttpServer())
      .put(`/api/v1/admin/content/story/${storySlug}/draft`)
      .set('x-content-api-key', apiKey)
      .send(draft)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/api/v1/content/story/${storySlug}`)
      .expect(404);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/content/story/${storySlug}/publish`)
      .set('x-content-api-key', apiKey)
      .send({})
      .expect(201);

    const published = await request(app.getHttpServer())
      .get(`/api/v1/content/story/${storySlug}`)
      .expect(200);
    expect(published.body.data.story.originBody).toContain(
      'editor-updated origin',
    );
  });

  it('publishes and serves a Gallery edit without an application rebuild', async () => {
    const liveGallery = await request(app.getHttpServer())
      .get('/api/v1/content/gallery')
      .expect(200);
    const original = structuredClone(liveGallery.body.data);
    const draft = structuredClone(original);
    draft.categories[0].items[0].item.caption =
      'Published by the Phase 7 editor flow.';

    await request(app.getHttpServer())
      .put('/api/v1/admin/content/gallery/gallery/draft')
      .set('x-content-api-key', apiKey)
      .send(draft)
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/v1/admin/content/gallery/gallery/publish')
      .set('x-content-api-key', apiKey)
      .send({})
      .expect(201);

    const published = await request(app.getHttpServer())
      .get('/api/v1/content/gallery')
      .expect(200);
    expect(published.body.data.categories[0].items[0].item.caption).toBe(
      'Published by the Phase 7 editor flow.',
    );

    await request(app.getHttpServer())
      .put('/api/v1/admin/content/gallery/gallery/draft')
      .set('x-content-api-key', apiKey)
      .send(original)
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/v1/admin/content/gallery/gallery/publish')
      .set('x-content-api-key', apiKey)
      .send({})
      .expect(201);
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM content_publish_outbox WHERE document_type = 'gallery' AND document_slug = 'gallery' AND created_at >= $1",
      [testStartedAt],
    );
    await pool.query(
      "DELETE FROM content_publish_outbox WHERE document_type = 'menu' AND document_slug = $1",
      [menuSlug],
    );
    await pool.query(
      "DELETE FROM content_documents WHERE document_type = 'menu' AND slug = $1",
      [menuSlug],
    );
    await pool.query(
      "DELETE FROM content_publish_outbox WHERE document_type = 'story' AND document_slug = $1",
      [storySlug],
    );
    await pool.query(
      "DELETE FROM content_documents WHERE document_type = 'story' AND slug = $1",
      [storySlug],
    );
    await pool.end();
    await app.close();
  });
});
