import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ReservationConfirmation } from "./reservation-confirmation";

describe("reservation confirmation", () => {
  it("shows server-confirmed details and contact", () => {
    const markup = renderToStaticMarkup(
      <ReservationConfirmation
        result={{
          idempotentReplay: false,
          reservation: {
            id: "reservation-id",
            reservationCode: "EO-TEST-123",
            date: "2026-10-20",
            startTime: "19:00",
            guestCount: 2,
            status: "CONFIRMED",
            createdAt: "2026-10-05T00:00:00Z",
          },
        }}
        guest={{
          name: "Guest",
          email: "guest@example.invalid",
          phone: "+84900000000",
          specialRequest: "Window seat",
        }}
      />,
    );
    expect(markup).toContain("Your table is reserved.");
    expect(markup).toContain("EO-TEST-123");
    expect(markup).toContain("7:00 PM");
    expect(markup).toContain("Window seat");
  });
});
