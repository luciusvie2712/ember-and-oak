import Link from "next/link";
import type { HomePage } from "@ember-and-oak/types";

import { reservationHref } from "@/config/navigation";

import styles from "./reservation-cta-section.module.css";

export function ReservationCtaSection({ home }: Readonly<{ home: HomePage }>) {
  return (
    <section aria-labelledby="reservation-cta-title" className={styles.section}>
      <p className="section-label">Your table awaits</p>
      <h2 id="reservation-cta-title">{home.reservationHeading}</h2>
      {home.reservationBody ? <p>{home.reservationBody}</p> : null}
      <Link className="button-link button-link--primary" href={reservationHref}>
        Reserve a Table
      </Link>
    </section>
  );
}
