import { randomUUID } from 'node:crypto';

import { Injectable, type NestMiddleware } from '@nestjs/common';
import { requestIdSchema } from '@ember-and-oak/validation';
import type { NextFunction, Response } from 'express';

import type { RequestWithId } from './request-context.js';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(request: RequestWithId, response: Response, next: NextFunction): void {
    const candidate = request.header('x-request-id');
    const requestId = requestIdSchema.safeParse(candidate).success
      ? candidate!
      : randomUUID();
    const startedAt = performance.now();

    request.requestId = requestId;
    response.setHeader('x-request-id', requestId);
    response.on('finish', () => {
      process.stdout.write(
        `${JSON.stringify({
          level: 'info',
          event: 'http.request',
          requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Math.round(performance.now() - startedAt),
        })}\n`,
      );
    });

    next();
  }
}
