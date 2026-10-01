# Ember & Oak

Phase 5 engineering foundation for the Ember & Oak public website, admin application, and API. This repository intentionally contains no production Home, Menu, Gallery, Story, reservation, admin reservation, or CMS feature implementation.

## Requirements

- Node.js 24.15.0
- pnpm 10.15.0 (enable Corepack if needed)
- Git 2.54 or newer
- Docker Desktop / Docker Compose v2 for local PostgreSQL

## First-time setup

```powershell
git clone <repository-url> ember-and-oak
cd ember-and-oak
corepack enable
pnpm install --frozen-lockfile
Copy-Item apps/api/.env.example apps/api/.env
docker compose up -d
pnpm db:check
pnpm dev
```

Open public web at `http://localhost:3000`, admin at `http://localhost:3001`, and API at `http://localhost:4000/api`. `pnpm dev` is persistent; stop it with Ctrl+C.

## Environment setup

Root `.env.example` controls local Compose defaults. Each app has its own `.env.example`. Copy examples to ignored `.env`/`.env.local` files and never put real credentials in Git. API startup validates all required settings and fails before listening when configuration is invalid. See [environment.md](docs/phase-5/environment.md) and [security-baseline.md](docs/phase-5/security-baseline.md).

## Common commands

| Command                                  | Purpose                                               |
| ---------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                               | Run web, admin, and API through Turbo                 |
| `pnpm dev:web` / `dev:admin` / `dev:api` | Run one application                                   |
| `pnpm format:check`                      | Verify formatting without changing files              |
| `pnpm lint`                              | Run ESLint/Oxlint across the workspace                |
| `pnpm typecheck`                         | Strict TypeScript validation                          |
| `pnpm test`                              | Unit/render tests                                     |
| `pnpm build`                             | Reproducible production builds                        |
| `pnpm test:integration`                  | Nest HTTP integration test                            |
| `pnpm test:e2e`                          | Playwright foundation smoke tests                     |
| `pnpm db:check`                          | Validate env and execute PostgreSQL `SELECT 1`        |
| `pnpm check`                             | Local CI-equivalent checks except Playwright/database |

## Project structure

```text
apps/
  web/          Next.js public app (3000)
  admin/        Next.js admin app (3001)
  api/          NestJS API (4000)
packages/
  ui/           Phase 4 tokens and accessible primitives
  config/       shared constants and strict TypeScript configs
  types/        generic cross-boundary contracts
  validation/   generic Zod schemas
infra/
  docker/       deployable API image
  staging/      Render staging blueprint
docs/phase-5/   architecture, operations, security, and exit gate
scripts/        scaffold history and staging smoke checks
```

Apps may consume `packages/*`, but may not import another app's source. Web/admin use the HTTP API boundary; database access remains in API infrastructure. Unresolved domain decisions must remain inputs rather than constants.

## Verification sequence

Run the same order as CI:

```powershell
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:integration
docker compose up -d
pnpm db:check
pnpm test:e2e
```

## Troubleshooting

- Wrong Node/pnpm: compare `node --version` and `pnpm --version` with `.node-version` and `packageManager`; re-enable Corepack.
- Port already in use: stop the process using 3000, 3001, 4000, or 5432; the fixed ports are part of the architecture contract.
- API exits immediately: create `apps/api/.env` from its example and correct the named invalid variables.
- Database check fails: run `docker compose ps`, wait for `healthy`, confirm port 5432 is free, then inspect `docker compose logs postgres`.
- Playwright browser missing: run `pnpm exec playwright install chromium`.
- Stale output: run `pnpm clean`, then the failing command again.

Architecture decisions and the complete gate are documented in [technical-architecture.md](docs/phase-5/technical-architecture.md) and [phase-5-exit-checklist.md](docs/phase-5/phase-5-exit-checklist.md).
