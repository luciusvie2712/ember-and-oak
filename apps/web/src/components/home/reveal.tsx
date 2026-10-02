"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type RevealProps = Readonly<{
  children: ReactNode;
  variant?: "fade" | "media";
}>;

export function Reveal({ children, variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.enhanced = "true";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.dataset.visible = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="reveal" data-reveal={variant} ref={ref}>
      {children}
    </div>
  );
}
