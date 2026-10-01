import 'dotenv/config';

import { loadEnvironment } from '../config/environment.js';
import { verifyDatabaseConnection } from './database-connectivity.js';

const environment = loadEnvironment();

await verifyDatabaseConnection(environment.DATABASE_URL);
process.stdout.write(
  `${JSON.stringify({ level: 'info', event: 'database.connectivity', status: 'ok' })}\n`,
);
