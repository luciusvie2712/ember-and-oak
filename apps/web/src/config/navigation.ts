export type PublicNavigationItem = Readonly<{
  href: string;
  label: string;
}>;

export const publicNavigation = [
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
] as const satisfies readonly PublicNavigationItem[];

export const reservationHref = "/reservations";

export function isNavigationItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
