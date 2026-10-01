import type { INestApplication } from '@nestjs/common';

import { ApiExceptionFilter } from './api-exception.filter.js';
import { RequestLoggingMiddleware } from './request-logging.middleware.js';

type HttpConfiguration = {
  corsOrigins?: string[];
};

export function configureHttpApplication(
  app: INestApplication,
  configuration: HttpConfiguration = {},
): void {
  const requestLogger = new RequestLoggingMiddleware();

  app.setGlobalPrefix('api');
  app.use(requestLogger.use.bind(requestLogger));
  app.useGlobalFilters(new ApiExceptionFilter());

  if (configuration.corsOrigins) {
    app.enableCors({
      origin: configuration.corsOrigins,
      credentials: true,
      methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
    });
  }
}
