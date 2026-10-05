import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ReservationApiError } from "../_lib/reservation-errors";
import { AvailabilityResults } from "./availability-results";

const base = { date: "2026-10-20", guestCount: 2, timezone: "Asia/Ho_Chi_Minh", slots: [] };
const onRetry = () => undefined;

describe("availability states", () => {
  it("announces loading", () => {
    expect(
      renderToStaticMarkup(
        <AvailabilityResults result={null} error={null} loading onRetry={onRetry} />,
      ),
    ).toContain("Checking availability");
  });

  it.each([
    ["CLOSED", "closed"],
    ["SPECIAL_CLOSURE", "unavailable"],
    ["NO_AVAILABILITY", "No tables"],
  ] as const)("renders %s", (status, message) => {
    expect(
      renderToStaticMarkup(
        <AvailabilityResults
          result={{ ...base, status }}
          error={null}
          loading={false}
          onRetry={onRetry}
        />,
      ),
    ).toContain(message);
  });

  it("shows a safe retryable error", () => {
    const markup = renderToStaticMarkup(
      <AvailabilityResults
        result={null}
        error={new ReservationApiError("INTERNAL_ERROR", 500)}
        loading={false}
        onRetry={onRetry}
      />,
    );
    expect(markup).toContain("Try again");
    expect(markup).not.toContain("SQL");
  });
});
