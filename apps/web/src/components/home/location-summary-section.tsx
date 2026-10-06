import type { PublicOperations } from "@ember-and-oak/types";

import { formatOpeningHours, weekdayNames } from "@/lib/operations/opening-hours-format";

import styles from "./location-summary-section.module.css";

export function LocationSummarySection({
  operations,
}: Readonly<{ operations: PublicOperations | null }>) {
  if (!operations) return null;
  const { location, contact, openingHours } = operations;
  const address = [
    location.addressLine1,
    location.addressLine2,
    location.wardOrDistrict,
    location.city,
    location.region,
    location.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section aria-labelledby="location-title" className={styles.section}>
      <div>
        <p className="section-label">Visit</p>
        <h2 id="location-title">Find your way to {location.name}.</h2>
      </div>
      <address>
        <p>{address}</p>
        <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </address>
      <div>
        {openingHours.map((hours) => (
          <p key={hours.dayOfWeek}>
            {weekdayNames[hours.dayOfWeek]}: {formatOpeningHours(hours)}
          </p>
        ))}
      </div>
      {location.directionsUrl ? (
        <a
          className="directional-link"
          href={location.directionsUrl}
          rel="noreferrer"
          target="_blank"
        >
          Get directions <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </section>
  );
}
