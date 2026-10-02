"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavigationItemActive, publicNavigation } from "@/config/navigation";

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <div className="desktop-navigation">
      {publicNavigation.map((i) => {
        const isActive = isNavigationItemActive(pathname, i.href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className="desktop-navigation__link"
            data-active={isActive ? "true" : undefined}
            href={i.href}
            key={i.href}
          >
            {i.label}
          </Link>
        );
      })}
    </div>
  );
}
