import { afterEach, describe, expect, it, vi } from "vitest";

import { createReservation, searchAvailability } from "./reservation-api";
import { ReservationApiError } from "./reservation-errors";

afterEach(() => vi.unstubAllGlobals());

const input = {
  date: "2026-10-20",
  startTime: "19:00",
  guestCount: 2,
  guest: { name: "Guest", email: "guest@example.invalid", phone: "+84900000000" },
};

describe("reservation API client", () => {
  it("fetches availability with date and guest count", async () => {
    const data = {
      date: input.date,
      guestCount: 2,
      timezone: "Asia/Ho_Chi_Minh",
      status: "AVAILABLE",
      slots: [],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ data }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(searchAvailability(input.date, 2)).resolves.toEqual(data);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("guests=2");
  });

  it("creates a reservation with one idempotency key", async () => {
    const data = { reservation: { reservationCode: "EO-TEST" }, idempotentReplay: false };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ data }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(createReservation(input, "logical-key")).resolves.toEqual(data);
    expect(fetchMock.mock.calls[0]?.[1].headers["Idempotency-Key"]).toBe("logical-key");
  });

  it.each([
    [409, "SLOT_CONFLICT"],
    [400, "PARTY_TOO_LARGE"],
    [500, "INTERNAL_ERROR"],
  ] as const)("maps %i %s", async (status, code) => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: { code, message: "raw" } }), { status }),
        ),
    );
    await expect(searchAvailability(input.date, 2)).rejects.toMatchObject({ code, status });
  });

  it("does not expose network exception details", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("secret connection details")));
    await expect(searchAvailability(input.date, 2)).rejects.toEqual(
      new ReservationApiError("REQUEST_ERROR", 0),
    );
  });
});
