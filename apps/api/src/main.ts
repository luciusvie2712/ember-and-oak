import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { loadEnvironment } from './config/environment.js';
import { verifyDatabaseConnection } from './database/database-connectivity.js';
import { configureHttpApplication } from './http/configure-http.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environment = loadEnvironment();
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  configureHttpApplication(app, {
    corsOrigins: environment.CORS_ORIGINS.split(',').map((origin) =>
      origin.trim(),
    ),
  });

  if (environment.DATABASE_CHECK_ON_STARTUP) {
    await verifyDatabaseConnection(environment.DATABASE_URL);
  }

  await app.listen(environment.PORT, '0.0.0.0');

  logger.log(`API listening on http://localhost:${environment.PORT}/api`);
}

void bootstrap();
