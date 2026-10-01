import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { trace: "on-first-retry" },
  webServer: [
    { command: "pnpm dev:web", port: 3000, reuseExistingServer: !process.env.CI },
    { command: "pnpm dev:admin", port: 3001, reuseExistingServer: !process.env.CI },
    {
      command:
        "cross-env DATABASE_URL=postgresql://ember:local_only_password@localhost:5432/ember_and_oak pnpm dev:api",
      port: 4000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
