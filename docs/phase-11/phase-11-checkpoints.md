# Phase 11 — Admin Backoffice

Status: **IN PROGRESS**

- [x] 11.0 Decisions / preflight
- [x] 11.1 Auth contracts and persistence
- [x] 11.2 Auth API
- [x] 11.3 Admin web authentication
- [x] 11.4 Authorization / content migration
- [x] 11.5 Reservation contracts
- [x] 11.6 Reservation read APIs
- [x] 11.7 Reservation mutation APIs
- [x] 11.8 Reservation UI
- [x] 11.9 Menu management (structured canonical editor)
- [x] 11.10 Content management (structured canonical editor)
- [x] 11.11 Operational content
- [x] 11.12 Media reference management
- [ ] 11.13 Manual table assignment — P1, deferred
- [ ] 11.14 Customer history — Release 1.1, deferred
- [ ] 11.15 Private-event management — Release 1.1, deferred
- [ ] 11.16 Tests / QA (automated suites pass; API lint host-blocked)
- [ ] 11.17 Staging verification

Implementation is not closed until automated tests, database migration verification,
responsive/accessibility checks and staging evidence pass. Optional 11.13–11.15 remain deferred.

## Local verification

Migration `004_phase_11_admin_backoffice` is idempotent on local PostgreSQL. Format, monorepo
typecheck, unit tests, production build, database check, 23 API integration tests and 33 Playwright
tests pass. API lint is currently blocked on this Windows host by Application Control rejecting the
installed oxlint native binding; Admin ESLint passes. Staging verification remains the release gate.
