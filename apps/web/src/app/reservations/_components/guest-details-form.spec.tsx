import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GuestDetailsForm } from "./guest-details-form";

describe("guest details form", () => {
  it("renders persistent labels and retains supplied values", () => {
    const markup = renderToStaticMarkup(
      <GuestDetailsForm
        value={{
          name: "Test Guest",
          email: "test@example.invalid",
          phone: "+84900000000",
          specialRequest: "Window seat",
        }}
        onChange={() => undefined}
        onSubmit={() => undefined}
        date="2026-10-20"
        startTime="19:00"
        guestCount={2}
        submitting={false}
      />,
    );
    expect(markup).toContain("Guest information");
    expect(markup).toContain('for="reservation-email"');
    expect(markup).toContain('value="test@example.invalid"');
    expect(markup).toContain("Window seat");
  });
});
