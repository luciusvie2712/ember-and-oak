import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("public web scaffold", () => {
  it("renders the foundation marker", () => {
    expect(renderToStaticMarkup(<Page />)).toContain("engineering foundation");
  });
});
