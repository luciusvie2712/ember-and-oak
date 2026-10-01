# Local PostgreSQL

`docker compose up -d` starts PostgreSQL 17 on port 5432 with a health check and a named development volume. The committed password is explicitly local-only. Copy `apps/api/.env.example` to `apps/api/.env`, then run `pnpm db:check`; it executes `SELECT 1`, closes the pool, and emits a structured success event.

No application tables or migrations exist in Phase 5. Reservation/customer/table/availability schemas are Phase 8 decisions. Staging uses a separate managed database and credentials; production never shares either.
