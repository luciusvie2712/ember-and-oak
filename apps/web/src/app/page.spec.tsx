import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => ({ connection: vi.fn().mockResolvedValue(undefined) }));

import HomePage from "./page";

describe("home shell", () => {
  it("fails closed without inventing Home content when the content API is unavailable", async () => {
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).toContain("Our dining room is preparing for service.");
    expect(markup).not.toContain("development-menu-data");
  });
});
