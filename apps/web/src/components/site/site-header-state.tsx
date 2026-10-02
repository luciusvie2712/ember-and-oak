"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type SiteHeaderStateProps = Readonly<{ children: ReactNode }>;

export function SiteHeaderState({ children }: SiteHeaderStateProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 16);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="site-header" data-scrolled={isScrolled}>
      {children}
    </header>
  );
}
