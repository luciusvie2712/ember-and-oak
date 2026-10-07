import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const adminBaseUrl = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:3101";

test.describe("Phase 7 canonical content", () => {
  test("Menu is server-rendered with data-driven navigation and distinct dish states", async ({
    page,
  }) => {
    await page.goto(`${webBaseUrl}/menu`);

    await expect(page.getByRole("heading", { level: 1, name: "Dinner" })).toBeVisible();
    const categoryNavigation = page.getByRole("navigation", { name: "Menu categories" });
    await expect(categoryNavigation.getByRole("link", { name: "From the hearth" })).toBeVisible();
    await categoryNavigation.getByRole("link", { name: "From the hearth" }).click();
    await expect(page).toHaveURL(/#from-the-hearth$/);
    await expect(page.getByRole("heading", { name: "Dry-aged duck" })).toBeVisible();
    await expect(page.getByText("Temporarily unavailable")).toBeVisible();
    await expect(page.getByRole("link", { name: "Reserve a Table" }).last()).toBeVisible();
  });

  test("Our Story preserves the narrative order and canonical Chef", async ({ page }) => {
    await page.goto(`${webBaseUrl}/our-story`);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Where it began" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "A shared table" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mara Ellison" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Use with care" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "A room for the evening" })).toBeVisible();
  });

  test("Gallery has stable responsive media and category filtering", async ({ page }) => {
    await page.goto(`${webBaseUrl}/gallery`);

    const images = page.locator("main img");
    await expect(images).toHaveCount(7);
    await expect(images.first()).toHaveAttribute("width", /\d+/);
    await expect(images.first()).toHaveAttribute("height", /\d+/);
    await expect(images.first()).toHaveAttribute("loading", "lazy");

    await page.getByRole("navigation", { name: "Gallery categories" }).getByText("Chef").click();
    await expect(page).toHaveURL(/category=chef/, { timeout: 15_000 });
    await expect(page.locator("main img")).toHaveCount(1);
  });

  test("Home reuses canonical Menu dishes and Chef profile", async ({ page }) => {
    await page.goto(webBaseUrl);
    await expect(page.getByRole("button", { name: /Ember-roasted roots/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mara Ellison" })).toBeVisible();
  });

  test("structured content editor requires a staff session", async ({ page }) => {
    await page.goto(`${adminBaseUrl}/content/menu/dinner`);
    await expect(page).toHaveURL(/\/login/);
    await page.getByLabel("Email").fill("admin-e2e@example.invalid");
    await page.getByLabel("Password").fill("phase-11-e2e-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(`${adminBaseUrl}/`);
    await page.goto(`${adminBaseUrl}/content/menu/dinner`);
    await expect(page.getByRole("heading", { name: "Structured content" })).toBeVisible();
    await expect(page.getByText("Canonical content JSON")).toHaveCount(0);
  });
});
