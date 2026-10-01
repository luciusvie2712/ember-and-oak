import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("admin scaffold", () => {
  it("renders the admin foundation marker", () => {
    expect(renderToStaticMarkup(<Page />)).toContain("Admin · engineering foundation");
  });
});
