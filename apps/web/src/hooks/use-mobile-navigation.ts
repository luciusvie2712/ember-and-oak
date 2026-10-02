"use client";

import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

type MobileNavigationRefs = Readonly<{
  panelRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}>;

export function useMobileNavigation({ panelRef, triggerRef }: MobileNavigationRefs) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const previousPathname = useRef(pathname);

  const close = useCallback(
    (restoreFocus = true) => {
      setIsOpen(false);
      if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [triggerRef],
  );

  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      if (isOpen) window.requestAnimationFrame(() => close());
    }
  }, [close, isOpen, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen, panelRef]);

  return { close, isOpen, open };
}
