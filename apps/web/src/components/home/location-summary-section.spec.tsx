import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LocationSummarySection } from "./location-summary-section";

describe("LocationSummarySection", () => {
  it("does not invent operational content when no canonical record exists", () => {
    expect(renderToStaticMarkup(<LocationSummarySection />)).toBe("");
  });
});
