"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { reservationHref } from "@/config/navigation";

export function MobileReserveCta() {
  const pathname = usePathname();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (pathname.startsWith(reservationHref) || footerVisible) return null;

  return (
    <aside aria-label="Reservation shortcut" className="mobile-reserve-cta">
      <Link href={reservationHref}>Reserve a Table</Link>
    </aside>
  );
}
