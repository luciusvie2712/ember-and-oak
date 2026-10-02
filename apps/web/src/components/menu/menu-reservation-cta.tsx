import Link from "next/link";

import { reservationHref } from "@/config/navigation";

import styles from "./menu.module.css";

export function MenuReservationCta() {
  return (
    <section aria-labelledby="menu-reservation-title" className={styles.cta}>
      <p className="section-label">Your table awaits</p>
      <h2 id="menu-reservation-title">Experience the menu.</h2>
      <Link className="button-link button-link--primary" href={reservationHref}>
        Reserve a Table
      </Link>
    </section>
  );
}
