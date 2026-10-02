import { describe, expect, it } from "vitest";

import { isNavigationItemActive, publicNavigation, reservationHref } from "./navigation";

describe("public navigation", () => {
  it("contains the approved primary navigation items", () => {
    expect(publicNavigation).toEqual([
      {
        href: "/",
        label: "Home",
      },
      {
        href: "/menu",
        label: "Menu",
      },
      {
        href: "/our-story",
        label: "Our Story",
      },
      {
        href: "/private-dining",
        label: "Private Dining",
      },
      {
        href: "/contact",
        label: "Contact",
      },
    ]);
  });

  it("uses the reservation route for the primary CTA", () => {
    expect(reservationHref).toBe("/reservations");
  });

  it("only marks Home active at the root route", () => {
    expect(isNavigationItemActive("/", "/")).toBe(true);

    expect(isNavigationItemActive("/menu", "/")).toBe(false);
  });

  it("marks an exact non-root route active", () => {
    expect(isNavigationItemActive("/our-story", "/our-story")).toBe(true);
  });

  it("keeps a parent navigation item active for nested routes", () => {
    expect(isNavigationItemActive("/private-dining/enquiry", "/private-dining")).toBe(true);
  });

  it("does not mark unrelated routes active", () => {
    expect(isNavigationItemActive("/contact", "/menu")).toBe(false);
  });
});
