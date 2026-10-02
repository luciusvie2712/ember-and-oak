import Link from "next/link";

import { reservationHref } from "@/config/navigation";

import styles from "./story.module.css";

export function StoryReservationCta() {
  return (
    <section aria-labelledby="story-reservation-title" className={styles.cta}>
      <p className="section-label">Join us</p>
      <h2 id="story-reservation-title">Continue the story at our table.</h2>
      <Link className="button-link button-link--primary" href={reservationHref}>
        Reserve a Table
      </Link>
    </section>
  );
}
