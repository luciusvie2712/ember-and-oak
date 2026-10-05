import { describe, expect, it } from "vitest";

import { sameLogicalRequest } from "./reservation-flow-state";

describe("logical reservation request", () => {
  it("reuses a key only for an unchanged body", () => {
    const current = { key: "key", serializedBody: '{"date":"2026-10-20"}' };
    expect(sameLogicalRequest(current, current.serializedBody)).toBe(true);
    expect(sameLogicalRequest(current, '{"date":"2026-10-21"}')).toBe(false);
    expect(sameLogicalRequest(null, current.serializedBody)).toBe(false);
  });
});
