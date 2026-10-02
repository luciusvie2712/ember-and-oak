# Staging Foundation

Selected targets: Vercel projects for web/admin, Render Docker service for API, and Render managed PostgreSQL. `infra/staging/render.yaml` and `infra/docker/api.Dockerfile` make the backend/database deployable; Vercel connects each Next.js workspace app with its own root directory.

Staging has separate database, sessions, integration keys, error tracking, and domains. It never reads production secrets. GitHub's protected `staging` environment stores deploy hooks and `WEB_STAGING_URL`, `ADMIN_STAGING_URL`, `API_STAGING_URL`. A merge to `main` passes CI, triggers deployments, and smoke-tests `/`, `/`, and `/api`. Until hooks exist, deployment is intentionally blocked rather than reported successful.

Provider configuration must set API CORS to the two staging origins and enable `DATABASE_CHECK_ON_STARTUP=true`. The API container applies idempotent migrations and inserts only missing canonical seed documents before startup.

Phase 7 staging additionally requires:

- the same `ADMIN_CONTENT_API_KEY` in API and admin;
- the same `WEB_REVALIDATION_SECRET` in API and web;
- `WEB_REVALIDATION_URL` pointing to the deployed web
  `/api/content/revalidate` route;
- `CONTENT_API_URL` in web/admin pointing to the deployed API;
- `ADMIN_EDITOR_USERNAME`, `ADMIN_EDITOR_PASSWORD`, and a stable
  `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` in admin;
- `IMAGE_CDN_URL` in web and `ASSET_CDN_URL` in API pointing to the selected
  staging media origin.

Promotion to production is outside Phase 5.
