# Phase 5 Technical Architecture

Status: LOCKED FOR ENGINEERING FOUNDATION

| Concern         | Decision                                                                  |
| --------------- | ------------------------------------------------------------------------- |
| Runtime         | Node.js 24.15.0                                                           |
| Package manager | pnpm 10.15.0                                                              |
| Repository      | pnpm workspace + Turborepo                                                |
| Apps            | `apps/web`, `apps/admin`, `apps/api`                                      |
| Packages        | `packages/ui`, `packages/config`, `packages/types`, `packages/validation` |
| Ports           | web 3000, admin 3001, API 4000, PostgreSQL 5432                           |
| Frontend        | Next.js App Router + TypeScript                                           |
| Backend         | NestJS + TypeScript                                                       |
| Database        | PostgreSQL 17 locally; managed PostgreSQL in staging                      |
| Validation      | Zod shared schemas; Nest DTO/global-pipe boundary                         |
| Testing         | Vitest + Playwright                                                       |
| CI              | GitHub Actions                                                            |
| Styling         | Semantic CSS custom properties and shared React primitives                |

Dependencies flow from apps to `packages/*`; an app may not import another app's internal source. Browser apps access the API over HTTP and never import database code. Phase 5 does not define reservation, availability, table, customer, currency, timezone, booking, cancellation, dress-code, address, or contact truth.
