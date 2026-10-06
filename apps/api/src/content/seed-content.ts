import 'dotenv/config';

import { Pool } from 'pg';

import { loadEnvironment } from '../config/environment.js';
import { publishedSchemas } from './content-contract.js';
import { seedDocuments } from './seed-data.js';

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: loadEnvironment().DATABASE_URL });
  try {
    for (const document of seedDocuments) {
      const canonical = publishedSchemas[document.type].parse(document.content);
      await pool.query(
        `INSERT INTO content_documents
           (document_type, slug, draft_revision, published_revision,
            publish_state, version, published_at)
         VALUES ($1, $2, $3::jsonb, $3::jsonb, 'PUBLISHED', 1, now())
         ON CONFLICT (document_type, slug) DO NOTHING`,
        [document.type, document.slug, JSON.stringify(canonical)],
      );
    }
  } finally {
    await pool.end();
  }
}

void seed();
