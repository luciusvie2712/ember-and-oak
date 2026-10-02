import { describe, expect, it } from "vitest";

import { formatMenuPrice } from "./format-menu-price";

describe("formatMenuPrice", () => {
  it("formats from amount and currency rather than a restaurant-wide hard-coded symbol", () => {
    expect(formatMenuPrice(35, "USD", "en-US")).toBe("$35");
    expect(formatMenuPrice(350_000, "VND", "vi-VN")).toContain("350.000");
  });
});
