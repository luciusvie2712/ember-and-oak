import { expect, test } from "@playwright/test";

test("public web scaffold responds", async ({ request }) => {
  const response = await request.get(process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("Seasonal dining");
});

test("admin scaffold responds", async ({ request }) => {
  const response = await request.get(process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:3101");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("Admin");
});

test("API bootstrap contract responds", async ({ request }) => {
  const response = await request.get(`${process.env.API_BASE_URL ?? "http://127.0.0.1:4100"}/api`);
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toEqual({ name: "ember-and-oak-api", status: "ok" });
  expect(response.headers()["x-request-id"]).toBeTruthy();
});
