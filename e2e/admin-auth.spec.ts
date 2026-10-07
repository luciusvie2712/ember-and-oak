import { expect, test } from "@playwright/test";

const adminBaseUrl = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:3101";

test("admin login, protected dashboard and logout", async ({ page }) => {
  await page.goto(adminBaseUrl);
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill("admin-e2e@example.invalid");
  await page.getByLabel("Password").fill("phase-11-e2e-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Good service starts here." })).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto(`${adminBaseUrl}/reservations`);
  await expect(page).toHaveURL(/\/login/);
});
