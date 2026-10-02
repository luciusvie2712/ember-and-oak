"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";

import { isNavigationItemActive, publicNavigation, reservationHref } from "@/config/navigation";

type MobileNavigationPanelProps = Readonly<{
  close: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
}>;

export function MobileNavigationPanel({ close, panelRef }: MobileNavigationPanelProps) {
  const pathname = usePathname();

  return (
    <div className="mobile-navigation-panel" id="mobile-navigation-panel">
      <button
        aria-label="Close navigation menu"
        className="mobile-navigation-panel__overlay"
        onClick={() => close()}
        type="button"
      />
      <div
        aria-label="Mobile navigation"
        aria-modal="true"
        className="mobile-navigation-panel__drawer"
        ref={panelRef}
        role="dialog"
      >
        <div className="mobile-navigation-panel__top">
          <span className="mobile-navigation-panel__brand">Ember &amp; Oak</span>
          <button
            aria-label="Close navigation menu"
            className="mobile-navigation-panel__close"
            onClick={() => close()}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label="Mobile primary navigation">
          <ol className="mobile-navigation-panel__links">
            {publicNavigation.map((item, index) => {
              const isActive = isNavigationItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    data-active={isActive ? "true" : undefined}
                    href={item.href}
                  >
                    <span aria-hidden="true">0{index + 1}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <Link className="mobile-navigation-panel__reserve" href={reservationHref}>
          Reserve a Table <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
