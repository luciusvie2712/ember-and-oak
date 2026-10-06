import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:4100";

test("Contact reflects published operations or honestly shows unpublished state", async ({
  page,
  request,
}) => {
  const response = await request.get(`${apiBaseUrl}/api/v1/operations`);
  await page.goto(`${webBaseUrl}/contact`);
  await expect(page.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
  if (response.status() === 404) {
    await expect(
      page.getByText("Our verified contact details are being prepared.", { exact: false }),
    ).toBeVisible();
  } else {
    expect(response.ok()).toBe(true);
    const operations = (await response.json()).data;
    await expect(page.getByText(operations.location.addressLine1)).toBeVisible();
    await expect(page.getByRole("link", { name: operations.contact.email })).toHaveAttribute(
      "href",
      `mailto:${operations.contact.email}`,
    );
    await expect(page.getByRole("link", { name: operations.contact.phoneDisplay })).toHaveAttribute(
      "href",
      `tel:${operations.contact.phoneE164}`,
    );
  }
  await expect(page.getByRole("link", { name: "Reserve a Table" }).first()).toBeVisible();
});

test("Contact remains usable at mobile and desktop widths", async ({ page }) => {
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${webBaseUrl}/contact`);
    await expect(page.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      `horizontal overflow at ${width}px`,
    ).toBe(false);
  }
});
