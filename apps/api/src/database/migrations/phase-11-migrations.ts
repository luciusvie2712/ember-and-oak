export const phaseElevenMigrations = [
  {
    id: '004_phase_11_admin_backoffice',
    sql: `
      CREATE TABLE IF NOT EXISTS admin_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL,
        display_name text NOT NULL,
        role text NOT NULL CHECK (role IN ('ADMIN', 'HOST', 'CONTENT_EDITOR')),
        password_hash text NOT NULL,
        password_salt text NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        failed_login_count integer NOT NULL DEFAULT 0,
        last_failed_login_at timestamptz,
        locked_until timestamptz,
        last_login_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_unique
        ON admin_users (lower(email));

      CREATE TABLE IF NOT EXISTS admin_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token_hash text NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_seen_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL,
        revoked_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions(user_id);
      CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);

      CREATE TABLE IF NOT EXISTS reservation_status_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reservation_id uuid NOT NULL REFERENCES reservations(id),
        actor_admin_user_id uuid NOT NULL REFERENCES admin_users(id),
        from_status text NOT NULL,
        to_status text NOT NULL,
        reason text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS reservation_status_events_reservation_idx
        ON reservation_status_events(reservation_id, created_at);
      CREATE INDEX IF NOT EXISTS reservations_date_time_idx
        ON reservations(reservation_date, start_time, id);
    `,
  },
] as const;
