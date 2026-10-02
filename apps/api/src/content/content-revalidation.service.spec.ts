import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ContentDatabaseService } from '../database/content-database.service.js';
import { ContentRevalidationService } from './content-revalidation.service.js';

describe('ContentRevalidationService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('keeps a failed outbox event pending and delivers it on retry', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://ember:test@localhost:5432/ember');
    vi.stubEnv('WEB_REVALIDATION_URL', 'https://web.example/revalidate');
    vi.stubEnv('WEB_REVALIDATION_SECRET', 'a_secure_test_secret_with_32_chars');

    const query = vi.fn(async (sql: string) => {
      if (sql.includes('SELECT id, tags, paths')) {
        return {
          rows: [
            {
              id: '5aaf9c9f-b323-4bc7-a10a-9a4b7e721364',
              tags: ['menu'],
              paths: ['/menu'],
            },
          ],
        };
      }
      return { rows: [] };
    });
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error('web unavailable'))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const service = new ContentRevalidationService({
      query,
    } as unknown as ContentDatabaseService);
    await service.flushPending();
    await service.flushPending();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(
      query.mock.calls.some(([sql]) => sql.includes('last_error = $2')),
    ).toBe(true);
    expect(
      query.mock.calls.some(([sql]) => sql.includes('delivered_at = now()')),
    ).toBe(true);
  });
});
