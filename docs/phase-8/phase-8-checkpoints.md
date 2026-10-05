# Phase 8 Checkpoints

Status: **8.0–8.9 COMPLETE LOCALLY; 8.10 PENDING STAGING ACCESS**

## Implementation

- [x] 8.0 business rules frozen in DEC-0026 through DEC-0037
- [x] 8.1 canonical contracts, validation, error codes, and unit tests
- [x] 8.2 schema, constraints, indexes, capacity and idempotency persistence
- [x] 8.3 central state-transition matrix
- [x] 8.4 data-backed opening hours, closures, capacity, and reservation queries
- [x] 8.5 shared availability engine
- [x] 8.6 atomic reservation creation with non-PII confirmation code
- [x] 8.7 request idempotency and date-level PostgreSQL advisory locking
- [x] 8.8 public availability and create endpoints
- [x] 8.9 unit, integration, idempotency, concurrency, and rollback coverage
- [ ] 8.10 staging deployment and evidence

## Local evidence

- Migration `002_phase_8_reservation` applied twice successfully.
- Validation package: 17 tests passed.
- API unit suite: 30 tests passed, including expired idempotency cleanup.
- API integration suite: 13 tests passed, including rollback, closure reason mapping, expired idempotency cleanup, `PARTY_TOO_LARGE` on both public endpoints, and cancelled-capacity coverage.
- Concurrency proof: two parallel three-cover requests against capacity four produced one `201` and one `409`; committed active covers remained at or below four.
- Idempotency proof: identical key/body returned the same reservation; changed body returned `IDEMPOTENCY_CONFLICT`.
- Rollback proof: a database constraint failure after customer insertion left no customer row.
- A timezone regression found by integration tests was fixed by mapping PostgreSQL business dates directly to `YYYY-MM-DD` strings.
- The final local `pnpm.cmd check` gate passed on 2026-10-05: format, lint, typecheck, unit tests, build, and integration tests. `pnpm.cmd db:check` passed, and `pnpm.cmd test:e2e` passed all 12 foundation tests.

Counts above describe the focused runs recorded during implementation. The final repository-wide gate should be used as the authoritative current result.

## Close condition

Phase 8 must not be marked closed until the staging checklist in `staging-verification.md` has real endpoint, database, concurrency, and PII/log evidence. No staging URL or platform access was supplied during local implementation.
