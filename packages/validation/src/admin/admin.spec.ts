import { describe, expect, it } from "vitest";
import { adminLoginSchema, adminReservationTransitionSchema } from "./index.js";

describe("admin validation", () => {
  it("normalizes login email and rejects weak input", () => {
    expect(
      adminLoginSchema.parse({ email: " HOST@EXAMPLE.COM ", password: "long-enough-password" })
        .email,
    ).toBe("host@example.com");
    expect(adminLoginSchema.safeParse({ email: "bad", password: "short" }).success).toBe(false);
  });
  it("bounds cancellation reasons", () => {
    expect(
      adminReservationTransitionSchema.safeParse({
        toStatus: "CANCELLED",
        expectedStatus: "CONFIRMED",
        reason: "x".repeat(501),
      }).success,
    ).toBe(false);
  });
});
