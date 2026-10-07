import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StructuredEditor } from "./content/[type]/[slug]/structured-editor";

describe("structured content editor", () => {
  it("renders labelled fields instead of raw JSON", () => {
    const markup = renderToStaticMarkup(
      <StructuredEditor initial={{ heroHeading: "Dinner", isActive: true }} />,
    );
    expect(markup).toContain("Hero Heading");
    expect(markup).not.toContain("Canonical content JSON");
  });
});
