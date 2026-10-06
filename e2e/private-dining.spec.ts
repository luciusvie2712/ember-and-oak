import { expect, test, type Page } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, idempotency-key",
};

async function fillEnquiry(page: Page) {
  await page.getByLabel("Name", { exact: true }).fill("Phase Ten Test");
  await page.getByLabel("Email").fill("phase10@example.invalid");
  await page.getByLabel("Phone").fill("+84900000000");
  await page.getByLabel("Event Date").fill("2026-12-20");
  await page.getByLabel("Guests").fill("18");
  await page.getByLabel("Event Type").fill("Team dinner");
  await page.getByLabel("Budget (optional)").fill("To discuss");
  await page.getByLabel("Message (optional)").fill("A quiet table, please.");
}

test("Private Dining shows three editorial experiences and successful enquiry", async ({
  page,
}) => {
  await page.route("**/api/v1/private-event-enquiries", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({ data: { id: "receipt-id", receivedAt: "2026-10-06T03:00:00Z" } }),
    });
  });
  await page.goto(`${webBaseUrl}/private-dining`);
  await expect(page.getByRole("heading", { name: "Private Dining", exact: true })).toBeVisible();
  await expect(page.locator(".private-dining-experience")).toHaveCount(3);
  await expect(page.getByText("12–20 guests")).toBeVisible();
  await expect(page.getByText("6–8 guests")).toBeVisible();
  await expect(page.getByText("Up to 80 guests")).toBeVisible();
  await page.getByRole("link", { name: "Plan Your Event" }).click();
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
  await expect(
    page.getByText("We’ve received your private dining enquiry.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("Your event is confirmed")).toHaveCount(0);
});

test("enquiry validation keeps values and focuses first invalid field", async ({ page }) => {
  await page.goto(`${webBaseUrl}/private-dining`);
  await page.getByLabel("Name", { exact: true }).fill("Phase Ten Test");
  await page.getByLabel("Email").fill("invalid");
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.locator(".enquiry-form__summary")).toContainText("Please correct");
  await expect(page.getByLabel("Email")).toBeFocused();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Phase Ten Test");
});

test("enquiry fields follow a keyboard-operable focus order", async ({ page }) => {
  await page.goto(`${webBaseUrl}/private-dining`);
  await page.getByLabel("Name", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Email")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Phone")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByLabel("Email")).toBeFocused();
});

test("network retry reuses the idempotency key and preserves form", async ({ page }) => {
  const keys: string[] = [];
  let attempts = 0;
  await page.route("**/api/v1/private-event-enquiries", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    keys.push(route.request().headers()["idempotency-key"] ?? "");
    attempts += 1;
    if (attempts === 1) {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({ data: { id: "receipt-id", receivedAt: "2026-10-06T03:00:00Z" } }),
    });
  });
  await page.goto(`${webBaseUrl}/private-dining`);
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.locator(".enquiry-form__summary")).toContainText("could not connect");
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Phase Ten Test");
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});

test("server failure stays safe and does not clear entered details", async ({ page }) => {
  await page.route("**/api/v1/private-event-enquiries", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({
        error: { code: "INTERNAL_ERROR", message: "secret backend details" },
      }),
    });
  });
  await page.goto(`${webBaseUrl}/private-dining`);
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.locator(".enquiry-form__summary")).toContainText("could not receive");
  await expect(page.getByLabel("Email")).toHaveValue("phase10@example.invalid");
  await expect(page.getByText("secret backend details")).toHaveCount(0);
});

test("rapid duplicate submit sends one logical request", async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/v1/private-event-enquiries", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    submissions += 1;
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({ data: { id: "receipt-id", receivedAt: "2026-10-06T03:00:00Z" } }),
    });
  });
  await page.goto(`${webBaseUrl}/private-dining`);
  await fillEnquiry(page);
  const button = page.getByRole("button", { name: "Send Enquiry" });
  await button.dblclick();
  await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
  expect(submissions).toBe(1);
});

test("Private Dining has no horizontal overflow at target widths", async ({ page }) => {
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${webBaseUrl}/private-dining`);
    await expect(page.locator(".private-dining-experience")).toHaveCount(3);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
});
