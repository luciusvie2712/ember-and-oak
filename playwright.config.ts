import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
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
        "cross-env NEXT_DIST_DIR=.next-e2e CONTENT_API_URL=http://127.0.0.1:4100 ADMIN_CONTENT_API_KEY=phase7_test_content_api_key_1234567 ADMIN_EDITOR_USERNAME=editor ADMIN_EDITOR_PASSWORD=phase7-editor-password pnpm --filter @ember-and-oak/admin e2e:serve",
      port: 3101,
      reuseExistingServer: false,
    },
    {
      command:
        "cross-env PORT=4100 DATABASE_URL=postgresql://ember:local_only_password@localhost:5432/ember_and_oak CORS_ORIGINS=http://127.0.0.1:3100 ADMIN_CONTENT_API_KEY=phase7_test_content_api_key_1234567 WEB_REVALIDATION_URL=http://127.0.0.1:3100/api/content/revalidate WEB_REVALIDATION_SECRET=phase7_test_revalidation_secret_123456 pnpm --filter @ember-and-oak/api start:e2e",
      port: 4100,
      reuseExistingServer: false,
    },
  ],
});
