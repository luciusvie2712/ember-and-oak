import { expect, test, type Page, type Route } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, idempotency-key",
};

async function handlePreflight(route: Route): Promise<boolean> {
  if (route.request().method() !== "OPTIONS") return false;
  await route.fulfill({ status: 204, headers: corsHeaders });
  return true;
}

function futureDate(days = 7): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day! + days)).toISOString().slice(0, 10);
}

function availability(
  date: string,
  status: "AVAILABLE" | "CLOSED" | "NO_AVAILABILITY" = "AVAILABLE",
  slots = ["19:00"],
) {
  return {
    data: {
      date,
      guestCount: 2,
      timezone: "Asia/Ho_Chi_Minh",
      status,
      slots:
        status === "AVAILABLE"
          ? slots.map((startTime) => ({ startTime, endTime: "21:00", available: true }))
          : [],
    },
  };
}

async function mockSearch(page: Page, response: (date: string) => object) {
  await page.route("**/api/v1/reservations/availability?**", async (route) => {
    const date = new URL(route.request().url()).searchParams.get("date") ?? futureDate();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(response(date)),
    });
  });
}

async function openSearch(page: Page, date = futureDate()) {
  await page.goto(webBaseUrl);
  await page
    .getByRole("link", { name: /reserve a table/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/reservations$/);
  await page.getByLabel("Date").fill(date);
  await page.getByLabel("Guests").selectOption("2");
  await page.getByRole("button", { name: "Find a Table" }).click();
}

async function fillGuest(page: Page) {
  await page.getByRole("radio", { name: "7:00 PM" }).check();
  await page.getByLabel("Name", { exact: true }).fill("Phase Nine Test");
  await page.getByLabel("Email").fill("phase9@example.invalid");
  await page.getByLabel("Phone").fill("+84900000000");
  await page.getByLabel("Special request (optional)").fill("Window seat");
}

test("guest can reserve a table from landing to confirmation", async ({ page }) => {
  const date = futureDate();
  await mockSearch(page, (requestedDate) => availability(requestedDate));
  let submittedKey = "";
  await page.route("**/api/v1/reservations", async (route) => {
    if (await handlePreflight(route)) return;
    submittedKey = route.request().headers()["idempotency-key"] ?? "";
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({
        data: {
          reservation: {
            id: "test-id",
            reservationCode: "EO-PHASE9",
            date,
            startTime: "19:00",
            guestCount: 2,
            status: "CONFIRMED",
            createdAt: new Date().toISOString(),
          },
          idempotentReplay: false,
        },
      }),
    });
  });
  await openSearch(page, date);
  await fillGuest(page);
  await page.getByRole("button", { name: "Reserve Table" }).click();
  await expect(page.getByRole("heading", { name: "Your table is reserved." })).toBeVisible();
  await expect(page.getByText("EO-PHASE9")).toBeVisible();
  expect(submittedKey).toMatch(/^[0-9a-f-]{36}$/i);
  await expect(page.locator("#confirmation-heading")).toBeFocused();
});

test("closed and fully booked states are distinct", async ({ page }) => {
  await mockSearch(page, (date) => availability(date, "CLOSED"));
  await openSearch(page);
  await expect(page.getByText(/restaurant is closed on this date/i)).toBeVisible();
  await page.unrouteAll();
  await mockSearch(page, (date) => availability(date, "NO_AVAILABILITY"));
  await page.getByRole("button", { name: "Find a Table" }).click();
  await expect(page.getByText(/no tables are available/i)).toBeVisible();
});

test("stale slot refreshes times and preserves guest information", async ({ page }) => {
  let searches = 0;
  await mockSearch(page, (date) =>
    availability(date, "AVAILABLE", ++searches === 1 ? ["19:00"] : ["19:30"]),
  );
  await page.route("**/api/v1/reservations", async (route) => {
    if (await handlePreflight(route)) return;
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ error: { code: "SLOT_CONFLICT" } }),
    });
  });
  await openSearch(page);
  await fillGuest(page);
  await page.getByRole("button", { name: "Reserve Table" }).click();
  await expect(page.getByText(/time is no longer available/i)).toBeVisible();
  await expect(page.getByRole("radio", { name: "7:30 PM" })).toBeVisible();
  await page.getByRole("radio", { name: "7:30 PM" }).check();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Phase Nine Test");
  await expect(page.getByLabel("Email")).toHaveValue("phase9@example.invalid");
});

test("network retry retains the same logical idempotency key", async ({ page }) => {
  await mockSearch(page, (date) => availability(date));
  const keys: string[] = [];
  await page.route("**/api/v1/reservations", async (route) => {
    if (await handlePreflight(route)) return;
    keys.push(route.request().headers()["idempotency-key"] ?? "");
    if (keys.length === 1) return route.abort("failed");
    return route.fulfill({
      status: 500,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ error: { code: "INTERNAL_ERROR" } }),
    });
  });
  await openSearch(page);
  await fillGuest(page);
  await page.getByRole("button", { name: "Reserve Table" }).click();
  await expect(page.getByText(/could not complete that request/i)).toBeVisible();
  await page.getByRole("button", { name: "Reserve Table" }).click();
  await expect.poll(() => keys.length).toBe(2);
  expect(keys[0]).toBe(keys[1]);
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Phase Nine Test");
});

test("mobile form is usable and global reserve shortcut does not cover it", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockSearch(page, (date) => availability(date));
  await openSearch(page);
  await fillGuest(page);
  await expect(page.locator(".mobile-reserve-cta")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reserve Table" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test("search limits regular parties to eight and links to Private Dining", async ({ page }) => {
  await page.goto(`${webBaseUrl}/reservations`);
  await expect(page.getByLabel("Guests").locator("option")).toHaveCount(8);
  await expect(page.getByRole("link", { name: /plan a private dining event/i })).toHaveAttribute(
    "href",
    "/private-dining",
  );
});

test("invalid guest information keeps entered values and focuses the first error", async ({
  page,
}) => {
  await mockSearch(page, (date) => availability(date));
  await openSearch(page);
  await page.getByRole("radio", { name: "7:00 PM" }).check();
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Reserve Table" }).click();
  await expect(page.getByText("Please check your information")).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Email")).toHaveValue("not-an-email");
  await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
});

test("duplicate clicks submit one logical request", async ({ page }) => {
  const date = futureDate();
  await mockSearch(page, (requestedDate) => availability(requestedDate));
  let submissions = 0;
  await page.route("**/api/v1/reservations", async (route) => {
    if (await handlePreflight(route)) return;
    submissions += 1;
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({
        data: {
          reservation: {
            id: "test-id",
            reservationCode: "EO-ONCE",
            date,
            startTime: "19:00",
            guestCount: 2,
            status: "CONFIRMED",
            createdAt: new Date().toISOString(),
          },
          idempotentReplay: false,
        },
      }),
    });
  });
  await openSearch(page, date);
  await fillGuest(page);
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      item.textContent?.includes("Reserve Table"),
    );
    button?.click();
    button?.click();
  });
  await expect(page.getByText("EO-ONCE")).toBeVisible();
  expect(submissions).toBe(1);
});

test("server error is retryable without exposing raw details", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/v1/reservations/availability?**", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "SQL secret" } }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify(availability(futureDate())),
      });
    }
  });
  await openSearch(page);
  await expect(page.getByText(/could not complete that request/i)).toBeVisible();
  await expect(page.getByText("SQL secret")).toHaveCount(0);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("radio", { name: "7:00 PM" })).toBeVisible();
});

test("slot can be selected with keyboard", async ({ page }) => {
  await mockSearch(page, (date) => availability(date));
  await openSearch(page);
  const slot = page.getByRole("radio", { name: "7:00 PM" });
  await slot.focus();
  await page.keyboard.press("Space");
  await expect(slot).toBeChecked();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
});

test("reservation form has no horizontal overflow at target widths", async ({ page }) => {
  await mockSearch(page, (date) => availability(date));
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openSearch(page);
    await page.getByRole("radio", { name: "7:00 PM" }).check();
    await expect(page.getByRole("button", { name: "Reserve Table" })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
