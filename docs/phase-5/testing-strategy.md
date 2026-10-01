# Testing Strategy

Vitest unit tests prove shared validation, public rendering, admin rendering, and the API service contract. API integration uses a real Nest application with Supertest and verifies `GET /api`. Playwright starts all three applications and verifies their HTTP foundations plus the request-ID response header. CI separately proves PostgreSQL connectivity.

Commands: `pnpm test` for unit tests, `pnpm test:integration` for module/HTTP integration, and `pnpm test:e2e` for Playwright. Feature-specific reservation tests are deferred with the feature. Tests must remain deterministic and must not depend on production data or secrets.
