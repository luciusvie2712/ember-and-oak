import { createHmac } from 'node:crypto';

import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';

import { loadEnvironment } from '../config/environment.js';
import { ContentDatabaseService } from '../database/content-database.service.js';

type PendingEvent = Readonly<{
  id: string;
  tags: string[];
  paths: string[];
}>;

@Injectable()
export class ContentRevalidationService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(ContentRevalidationService.name);
  private flushPromise: Promise<void> | null = null;
  private retryTimer: NodeJS.Timeout | undefined;

  constructor(private readonly database: ContentDatabaseService) {}

  onApplicationBootstrap(): void {
    void this.flushPending();
    this.retryTimer = setInterval(() => void this.flushPending(), 30_000);
    this.retryTimer.unref();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.retryTimer) clearInterval(this.retryTimer);
    await this.flushPromise;
  }

  flushPending(): Promise<void> {
    if (!this.flushPromise) {
      this.flushPromise = this.deliverPending().finally(() => {
        this.flushPromise = null;
      });
    }
    return this.flushPromise;
  }

  private async deliverPending(): Promise<void> {
    const environment = loadEnvironment();
    if (
      !environment.WEB_REVALIDATION_URL ||
      !environment.WEB_REVALIDATION_SECRET
    )
      return;

    const result = await this.database.query<PendingEvent>(
      `SELECT id, tags, paths
       FROM content_publish_outbox
       WHERE delivered_at IS NULL
       ORDER BY created_at
       LIMIT 25`,
    );

    for (const event of result.rows) {
      const payload = JSON.stringify({
        eventId: event.id,
        tags: event.tags,
        paths: event.paths,
        timestamp: Date.now(),
      });
      const signature = createHmac(
        'sha256',
        environment.WEB_REVALIDATION_SECRET,
      )
        .update(payload)
        .digest('hex');

      try {
        const response = await fetch(environment.WEB_REVALIDATION_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-content-signature': signature,
          },
          body: payload,
        });
        if (!response.ok)
          throw new Error(`Revalidation returned ${response.status}`);

        await this.database.query(
          `UPDATE content_publish_outbox
           SET delivered_at = now(), attempt_count = attempt_count + 1, last_error = NULL
           WHERE id = $1`,
          [event.id],
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown revalidation failure';
        this.logger.warn(`Content revalidation ${event.id} failed: ${message}`);
        await this.database.query(
          `UPDATE content_publish_outbox
           SET attempt_count = attempt_count + 1, last_error = $2
           WHERE id = $1`,
          [event.id, message.slice(0, 1000)],
        );
      }
    }
  }
}
