import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { ContactInformation } from "@/components/operations/contact-information";
import { OpeningHours } from "@/components/operations/opening-hours";
import { getPublicOperations } from "@/lib/operations/operations-repository";

import "./contact.css";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  await connection();
  const operations = await getPublicOperations().catch(() => null);

  if (!operations) {
    return (
      <section className="public-page">
        <p className="section-label">Visit</p>
        <h1>Contact</h1>
        <p>Our verified contact details are being prepared. Please check back shortly.</p>
        <Link className="directional-link" href="/reservations">
          Reserve a Table →
        </Link>
      </section>
    );
  }

  return (
    <div className="contact-page">
      <header className="contact-page__header">
        <p className="section-label">Visit</p>
        <h1>Contact</h1>
        <p>We look forward to welcoming you to {operations.location.name}.</p>
      </header>
      <section className="contact-page__details" aria-label="Location and opening hours">
        <div>
          <p className="section-label">Location</p>
          <h2>Find us.</h2>
          <ContactInformation location={operations.location} contact={operations.contact} />
        </div>
        <div>
          <p className="section-label">Opening hours</p>
          <h2>Join us.</h2>
          <OpeningHours hours={operations.openingHours} />
        </div>
      </section>
      {operations.specialClosures.length > 0 ? (
        <section className="contact-page__closures" aria-labelledby="closures-title">
          <h2 id="closures-title">Service updates</h2>
          <ul>
            {operations.specialClosures.map((closure) => (
              <li key={`${closure.date}-${closure.startTime ?? "all-day"}`}>
                <time dateTime={closure.date}>{closure.date}</time>
                {closure.publicMessage ? ` — ${closure.publicMessage}` : " — Service unavailable"}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {operations.policies.length > 0 ? (
        <section className="contact-page__policies" aria-labelledby="policies-title">
          <h2 id="policies-title">Policies</h2>
          {operations.policies.map((policy) => (
            <article key={policy.type}>
              <h3>{policy.title}</h3>
              <p>{policy.body}</p>
            </article>
          ))}
        </section>
      ) : null}
      <div className="contact-page__cta">
        <p>We have a place for you at the table.</p>
        <Link className="button-link button-link--primary" href="/reservations">
          Reserve a Table
        </Link>
      </div>
    </div>
  );
}
