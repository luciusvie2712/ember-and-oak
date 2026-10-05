import { describe, expect, it } from "vitest";

import {
  dateAfterDays,
  formatReservationDate,
  formatReservationTime,
  restaurantToday,
} from "./reservation-format";

describe("restaurant-local reservation formatting", () => {
  it("uses the restaurant date across a UTC day boundary", () => {
    expect(restaurantToday(new Date("2026-10-05T18:00:00Z"))).toBe("2026-10-06");
  });

  it("adds calendar days without local timezone drift", () => {
    expect(dateAfterDays("2026-10-05", 30)).toBe("2026-11-04");
  });

  it("formats wall-clock booking values without converting the time", () => {
    expect(formatReservationDate("2026-10-20")).toContain("October 20");
    expect(formatReservationTime("19:00")).toBe("7:00 PM");
  });
});
