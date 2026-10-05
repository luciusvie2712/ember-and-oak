import { describe, expect, it } from "vitest";

import { createReservationSchema, reservationStatusSchema } from "./reservation.js";

const valid = {
  date: "2026-10-20",
  startTime: "19:00",
  guestCount: 2,
  guest: { name: "Guest", email: "guest@example.com", phone: "+84901234567" },
};

describe("reservation validation", () => {
  it("accepts a canonical reservation request", () => {
    expect(createReservationSchema.parse(valid).guest.email).toBe("guest@example.com");
  });

  it.each([
    [{ ...valid, guestCount: 0 }, "zero guests"],
    [{ ...valid, guestCount: 9 }, "large parties"],
    [{ ...valid, date: "2026-02-30" }, "invalid dates"],
    [{ ...valid, guest: { ...valid.guest, email: "invalid" } }, "invalid email"],
    [{ ...valid, specialRequest: "x".repeat(1001) }, "long requests"],
  ])("rejects invalid input: %s", (input, _label) => {
    expect(createReservationSchema.safeParse(input).success).toBe(false);
  });

  it("rejects an invalid status", () => {
    expect(reservationStatusSchema.safeParse("DELETED").success).toBe(false);
  });
});
