export const reservationMigrations = [
  {
    id: '002_phase_8_reservation',
    sql: `
      CREATE TABLE IF NOT EXISTS customers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        vip_tag text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        reservation_code text NOT NULL UNIQUE,
        customer_id uuid NOT NULL REFERENCES customers(id),
        reservation_date date NOT NULL,
        start_time time NOT NULL,
        guest_count integer NOT NULL CHECK (guest_count > 0),
        status text NOT NULL CHECK (
          status IN ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
        ),
        special_request text,
        internal_note text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        cancelled_at timestamptz
      );

      CREATE INDEX IF NOT EXISTS reservations_date_idx
        ON reservations (reservation_date);
      CREATE INDEX IF NOT EXISTS reservations_date_status_idx
        ON reservations (reservation_date, status);
      CREATE INDEX IF NOT EXISTS reservations_customer_idx
        ON reservations (customer_id);

      CREATE TABLE IF NOT EXISTS opening_hours (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        day_of_week integer NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
        open_time time,
        close_time time,
        is_closed boolean NOT NULL DEFAULT false,
        CHECK (
          (is_closed AND open_time IS NULL AND close_time IS NULL)
          OR
          (NOT is_closed AND open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
        )
      );

      INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed)
      VALUES
        (0, '17:00', '22:00', false),
        (1, NULL, NULL, true),
        (2, '17:30', '22:30', false),
        (3, '17:30', '22:30', false),
        (4, '17:30', '22:30', false),
        (5, '17:30', '23:30', false),
        (6, '17:30', '23:30', false)
      ON CONFLICT (day_of_week) DO NOTHING;

      CREATE TABLE IF NOT EXISTS special_closures (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        closure_date date NOT NULL,
        closure_type text NOT NULL CHECK (closure_type IN ('FULL_DAY', 'PARTIAL_DAY')),
        start_time time,
        end_time time,
        reason text NOT NULL,
        public_message text,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CHECK (
          (closure_type = 'FULL_DAY' AND start_time IS NULL AND end_time IS NULL)
          OR
          (closure_type = 'PARTIAL_DAY' AND start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
        )
      );
      CREATE INDEX IF NOT EXISTS special_closures_date_idx
        ON special_closures (closure_date);

      CREATE TABLE IF NOT EXISTS service_capacities (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        day_of_week integer NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
        capacity integer NOT NULL CHECK (capacity > 0),
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS dining_tables (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL UNIQUE,
        capacity integer NOT NULL CHECK (capacity > 0),
        is_active boolean NOT NULL DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS reservation_tables (
        reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
        table_id uuid NOT NULL REFERENCES dining_tables(id),
        PRIMARY KEY (reservation_id, table_id)
      );

      CREATE TABLE IF NOT EXISTS reservation_idempotency (
        idempotency_key text PRIMARY KEY,
        request_hash text NOT NULL,
        reservation_id uuid REFERENCES reservations(id),
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS reservation_idempotency_expires_idx
        ON reservation_idempotency (expires_at);
    `,
  },
] as const;
