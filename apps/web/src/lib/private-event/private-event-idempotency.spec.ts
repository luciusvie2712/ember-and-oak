import { describe, expect, it } from "vitest";

import { keyForEnquiry } from "./private-event-idempotency";

describe("private-event logical idempotency", () => {
  it("keeps the key on a network retry of the same normalized payload", () => {
    const first = keyForEnquiry(null, '{"guests":18}', () => "first-key");
    expect(keyForEnquiry(first, '{"guests":18}', () => "wrong-key")).toBe(first);
    expect(keyForEnquiry(first, '{"guests":19}', () => "new-key").key).toBe("new-key");
  });
});
