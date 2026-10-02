import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";

test.describe("Phase 6 home and navigation", () => {
  test("desktop header, navigation, and hero actions work", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(webBaseUrl);

    await expect(
      page.getByRole("heading", { level: 1, name: /seasonal dining, refined/i }),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.locator(".desktop-navigation")).toBeVisible();
    await expect(page.locator(".site-header")).toHaveAttribute("data-scrolled", "false");
    await expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(page.locator(".site-header")).toHaveAttribute("data-scrolled", "true");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(".site-header")).toHaveAttribute("data-scrolled", "false");

    await page.getByRole("link", { name: "View Menu" }).click();
    await expect(page).toHaveURL(/\/menu$/);
    await expect(page.getByRole("heading", { level: 1, name: "Dinner" })).toBeVisible();
  });

  test("mobile drawer traps focus, closes with Escape, and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(webBaseUrl);

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation menu" }).last()).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("mobile route navigation closes the drawer and sticky CTA follows route rules", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(webBaseUrl);
    await expect(page.getByRole("complementary", { name: "Reservation shortcut" })).toBeVisible();

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Menu", exact: true }).click();
    await expect(page).toHaveURL(/\/menu$/);
    await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();

    await page.goto(webBaseUrl);
    await page.getByRole("complementary").getByRole("link", { name: "Reserve a Table" }).click();
    await expect(page).toHaveURL(/\/reservations$/);
    await expect(page.getByRole("heading", { level: 1, name: "Reserve a Table" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Reservation shortcut" })).toBeHidden();
  });

  test("signature menu keyboard focus updates the featured state", async ({ page }) => {
    await page.goto(webBaseUrl);
    const rows = page.locator(".signature-menu-row");
    await rows.nth(1).focus();
    await expect(rows.nth(1)).toHaveAttribute("aria-pressed", "true");
    await rows.nth(2).focus();
    await expect(rows.nth(2)).toHaveAttribute("aria-pressed", "true");
  });
});
