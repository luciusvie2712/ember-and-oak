import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 4,
  reporter: process.env.CI ? "github" : "list",
  use: { trace: "on-first-retry" },
  webServer: [
    {
      command:
        "cross-env NEXT_DIST_DIR=.next-e2e CONTENT_API_URL=http://127.0.0.1:4100 NEXT_PUBLIC_API_URL=http://127.0.0.1:4100 WEB_REVALIDATION_SECRET=phase7_test_revalidation_secret_123456 pnpm --filter @ember-and-oak/web e2e:serve",
      port: 3100,
      reuseExistingServer: false,
    },
    {
      command:
        "cross-env NEXT_DIST_DIR=.next-e2e ADMIN_API_URL=http://127.0.0.1:4100 ADMIN_COOKIE_SECURE=false pnpm --filter @ember-and-oak/admin e2e:serve",
      port: 3101,
      reuseExistingServer: false,
    },
    {
      command:
        "cross-env PORT=4100 DATABASE_URL=postgresql://ember:local_only_password@localhost:5432/ember_and_oak CORS_ORIGINS=http://127.0.0.1:3100 ADMIN_E2E_EMAIL=admin-e2e@example.invalid ADMIN_E2E_PASSWORD=phase-11-e2e-password WEB_REVALIDATION_URL=http://127.0.0.1:3100/api/content/revalidate WEB_REVALIDATION_SECRET=phase7_test_revalidation_secret_123456 pnpm --filter @ember-and-oak/api start:e2e",
      port: 4100,
      reuseExistingServer: false,
    },
  ],
});
