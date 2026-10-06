import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';

import { ContentDatabaseService } from '../database/content-database.service.js';

@Injectable()
export class PrivateEventIdempotencyMaintenanceService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    PrivateEventIdempotencyMaintenanceService.name,
  );
  private timer: NodeJS.Timeout | undefined;

  constructor(private readonly database: ContentDatabaseService) {}

  onModuleInit(): void {
    this.runSafely();
    this.timer = setInterval(() => this.runSafely(), 60 * 60_000);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async cleanupExpired(): Promise<number> {
    const result = await this.database.query(
      `DELETE FROM private_event_enquiry_idempotency WHERE expires_at <= now()`,
    );
    return result.rowCount ?? 0;
  }

  private runSafely(): void {
    void this.cleanupExpired().catch(() => {
      this.logger.error(
        'Failed to clean expired private-event idempotency records',
      );
    });
  }
}
