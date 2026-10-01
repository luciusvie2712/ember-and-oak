# Staging Foundation

Selected targets: Vercel projects for web/admin, Render Docker service for API, and Render managed PostgreSQL. `infra/staging/render.yaml` and `infra/docker/api.Dockerfile` make the backend/database deployable; Vercel connects each Next.js workspace app with its own root directory.

Staging has separate database, sessions, integration keys, error tracking, and domains. It never reads production secrets. GitHub's protected `staging` environment stores deploy hooks and `WEB_STAGING_URL`, `ADMIN_STAGING_URL`, `API_STAGING_URL`. A merge to `main` passes CI, triggers deployments, and smoke-tests `/`, `/`, and `/api`. Until hooks exist, deployment is intentionally blocked rather than reported successful.

Provider configuration must set API CORS to the two staging origins and enable `DATABASE_CHECK_ON_STARTUP=true`. Promotion to production is outside Phase 5.
