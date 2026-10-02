import styles from "./location-summary-section.module.css";

type LocationSummary = Readonly<{
  address: string;
  openingHours: readonly string[];
  phone: string;
  email: string;
  directionsUrl: string;
}>;

type LocationSummarySectionProps = Readonly<{ location?: LocationSummary }>;

export function LocationSummarySection({ location }: LocationSummarySectionProps) {
  if (!location) return null;

  return (
    <section aria-labelledby="location-title" className={styles.section}>
      <div>
        <p className="section-label">Visit</p>
        <h2 id="location-title">Find your way to Ember &amp; Oak.</h2>
      </div>
      <address>
        <p>{location.address}</p>
        <a href={`tel:${location.phone}`}>{location.phone}</a>
        <a href={`mailto:${location.email}`}>{location.email}</a>
      </address>
      <div>
        {location.openingHours.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <a
        className="directional-link"
        href={location.directionsUrl}
        rel="noreferrer"
        target="_blank"
      >
        Get directions <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
