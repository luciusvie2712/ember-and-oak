import { describe, expect, it } from "vitest";

import { emailSchema, phoneSchema } from "./index.js";

describe("shared validation", () => {
  it("accepts normalized email and phone inputs", () => {
    expect(emailSchema.parse("guest@example.com")).toBe("guest@example.com");
    expect(phoneSchema.parse("+84 123 456 789")).toBe("+84 123 456 789");
  });
});
