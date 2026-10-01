# Continuous Integration

`.github/workflows/ci.yml` executes checkout → Node/pnpm setup → frozen install → format check → lint → typecheck → unit test → build → integration test → database connectivity → Playwright foundation E2E. CI never rewrites source.

The `quality` job is the required branch-protection check. On `main`, the protected `staging` environment triggers configured web/admin/API deployment hooks and smoke-tests the three staging URLs. Repository administrators must configure the three hook secrets and URL variables before enabling that gate.
