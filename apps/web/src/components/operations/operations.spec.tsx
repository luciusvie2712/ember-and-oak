import type { PublicContactInformation, PublicRestaurantLocation } from "@ember-and-oak/types";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactInformation } from "./contact-information";
import { OpeningHours } from "./opening-hours";

const location: PublicRestaurantLocation = {
  name: "Ember & Oak fixture",
  addressLine1: "Fixture street",
  city: "Ho Chi Minh City",
  countryCode: "VN",
  timezone: "Asia/Ho_Chi_Minh",
};
const contact: PublicContactInformation = {
  email: "fixture@example.invalid",
  phoneDisplay: "+84 90 000 0000",
  phoneE164: "+84900000000",
};

describe("canonical operational components", () => {
  it("renders email and phone as actions, but omits unconfirmed directions", () => {
    const html = renderToStaticMarkup(<ContactInformation location={location} contact={contact} />);
    expect(html).toContain('href="mailto:fixture@example.invalid"');
    expect(html).toContain('href="tel:+84900000000"');
    expect(html).not.toContain("Get Directions");
  });

  it("uses the same day-index and closed record semantics as operations API", () => {
    const html = renderToStaticMarkup(
      <OpeningHours
        hours={[
          { dayOfWeek: 1, isClosed: true },
          { dayOfWeek: 2, openTime: "17:30", closeTime: "22:30", isClosed: false },
        ]}
      />,
    );
    expect(html).toContain("Monday");
    expect(html).toContain("Closed");
    expect(html).toContain("Tuesday");
    expect(html).toContain("5:30 PM–10:30 PM");
  });
});
