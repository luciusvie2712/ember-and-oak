import { describe, expect, it } from "vitest";

import { privateEventEnquirySchema } from "./index.js";

const valid = {
  name: "Fixture Guest",
  email: "guest@example.invalid",
  phone: "+84901234567",
  eventDate: "2026-12-20",
  guests: 18,
  eventType: "Team dinner",
};

describe("private-event enquiry validation", () => {
  it("accepts free-text event type and optional budget without assuming currency", () => {
    expect(privateEventEnquirySchema.parse({ ...valid, budget: "To be discussed" })).toMatchObject({
      eventType: "Team dinner",
      budget: "To be discussed",
    });
  });

  it.each([
    { ...valid, email: "invalid" },
    { ...valid, phone: "123" },
    { ...valid, eventDate: "2026-02-30" },
    { ...valid, guests: 0 },
    { ...valid, guests: 501 },
    { ...valid, eventType: "" },
    { ...valid, message: "x".repeat(2001) },
  ])("rejects invalid enquiry input %#", (input) => {
    expect(privateEventEnquirySchema.safeParse(input).success).toBe(false);
  });
});
