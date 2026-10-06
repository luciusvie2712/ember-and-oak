export const phaseTenMigrations = [
  {
    id: '003_phase_10_operational',
    sql: `
      ALTER TABLE content_documents
        DROP CONSTRAINT IF EXISTS content_documents_document_type_check;
      ALTER TABLE content_documents
        ADD CONSTRAINT content_documents_document_type_check
        CHECK (document_type IN (
          'menu', 'story', 'gallery', 'home', 'chef', 'media',
          'private-dining', 'operations'
        ));

      CREATE TABLE IF NOT EXISTS private_event_enquiries (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        event_date date NOT NULL,
        guests integer NOT NULL CHECK (guests > 0),
        event_type text NOT NULL,
        budget text,
        message text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS private_event_enquiries_date_idx
        ON private_event_enquiries (event_date);
      CREATE INDEX IF NOT EXISTS private_event_enquiries_created_idx
        ON private_event_enquiries (created_at);

      CREATE TABLE IF NOT EXISTS private_event_enquiry_idempotency (
        idempotency_key text PRIMARY KEY,
        request_hash text NOT NULL,
        enquiry_id uuid REFERENCES private_event_enquiries(id),
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS private_event_enquiry_idempotency_expires_idx
        ON private_event_enquiry_idempotency (expires_at);
    `,
  },
] as const;
