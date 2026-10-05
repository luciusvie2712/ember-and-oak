import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';

import { ContentDatabaseService } from '../database/content-database.service.js';
import { reservationConfig } from './reservation-config.js';

@Injectable()
export class ReservationIdempotencyMaintenanceService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    ReservationIdempotencyMaintenanceService.name,
  );
  private cleanupTimer: NodeJS.Timeout | undefined;

  constructor(private readonly database: ContentDatabaseService) {}

  onModuleInit(): void {
    this.runCleanupSafely();
    this.cleanupTimer = setInterval(
      () => this.runCleanupSafely(),
      reservationConfig.idempotencyCleanupIntervalMs,
    );
    this.cleanupTimer.unref();
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  async cleanupExpired(): Promise<number> {
    const result = await this.database.query(
      `DELETE FROM reservation_idempotency WHERE expires_at <= now()`,
    );
    return result.rowCount ?? 0;
  }

  private runCleanupSafely(): void {
    void this.cleanupExpired().catch(() => {
      this.logger.error(
        'Failed to clean expired reservation idempotency records',
      );
    });
  }
}
