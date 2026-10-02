export const contentMigrations = [
  {
    id: '001_phase_7_content',
    sql: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS content_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        document_type text NOT NULL CHECK (
          document_type IN ('menu', 'story', 'gallery', 'home', 'chef', 'media')
        ),
        slug text NOT NULL,
        draft_revision jsonb,
        published_revision jsonb,
        publish_state text NOT NULL DEFAULT 'DRAFT' CHECK (
          publish_state IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')
        ),
        version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
        published_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (document_type, slug)
      );

      CREATE INDEX IF NOT EXISTS content_documents_public_lookup
        ON content_documents (document_type, slug)
        WHERE publish_state = 'PUBLISHED';

      CREATE TABLE IF NOT EXISTS content_publish_outbox (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        document_type text NOT NULL,
        document_slug text NOT NULL,
        tags jsonb NOT NULL,
        paths jsonb NOT NULL,
        attempt_count integer NOT NULL DEFAULT 0,
        last_error text,
        delivered_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS content_publish_outbox_pending
        ON content_publish_outbox (created_at)
        WHERE delivered_at IS NULL;
    `,
  },
] as const;
