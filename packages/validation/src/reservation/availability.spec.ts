import { describe, expect, it } from "vitest";

import { availabilityHttpQuerySchema, availabilityQuerySchema } from "./availability.js";

describe("availability validation", () => {
  it("coerces the HTTP guest query", () => {
    expect(availabilityHttpQuerySchema.parse({ date: "2026-10-20", guests: "2" })).toEqual({
      date: "2026-10-20",
      guests: 2,
    });
  });

  it.each([0])("rejects guest count %i", (guestCount) => {
    expect(availabilityQuerySchema.safeParse({ date: "2026-10-20", guestCount }).success).toBe(
      false,
    );
  });

  it("accepts large-party shape for domain handling", () => {
    expect(availabilityQuerySchema.safeParse({ date: "2026-10-20", guestCount: 9 }).success).toBe(
      true,
    );
    expect(availabilityHttpQuerySchema.safeParse({ date: "2026-10-20", guests: "9" }).success).toBe(
      true,
    );
  });
});
