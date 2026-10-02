import Link from "next/link";

import { reservationHref } from "@/config/navigation";

import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { SiteHeaderState } from "./site-header-state";

export function SiteHeader() {
  return (
    <SiteHeaderState>
      <nav aria-label="Primary navigation" className="site-header__inner">
        <Link aria-label="Ember & Oak home page" className="site-header__brand" href="/">
          Ember &amp; Oak
        </Link>

        <DesktopNavigation />

        <Link className="site-header__reserve" href={reservationHref}>
          Reserve a Table
        </Link>

        <MobileNavigation />
      </nav>
    </SiteHeaderState>
  );
}
