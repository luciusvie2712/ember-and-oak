"use client";

import { useRef } from "react";

import { useMobileNavigation } from "@/hooks/use-mobile-navigation";

import { MobileNavigationPanel } from "./mobile-navigation-panel";

export function MobileNavigation() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { close, isOpen, open } = useMobileNavigation({ panelRef, triggerRef });

  return (
    <div className="mobile-navigation">
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        className="mobile-navigation__trigger"
        onClick={open}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span className="mobile-navigation__trigger-label">Menu</span>
      </button>

      {isOpen ? <MobileNavigationPanel close={close} panelRef={panelRef} /> : null}
    </div>
  );
}
