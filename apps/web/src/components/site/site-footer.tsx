import Link from "next/link";

import { publicNavigation, reservationHref } from "@/config/navigation";
import { getPublicOperations } from "@/lib/operations/operations-repository";

const storyNavigation = publicNavigation.filter(
  (item) => item.href === "/menu" || item.href === "/private-dining" || item.href === "/contact",
);

const reservationNavigation = [
  {
    href: reservationHref,
    label: "Reserve",
  },
  {
    href: "/contact",
    label: "Contact",
  },
] as const;

export async function SiteFooter() {
  const operations = await getPublicOperations().catch(() => null);
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__statement">
          <span>Come hungry.</span>
          <span>Leave inspired.</span>
        </p>

        <nav aria-label="Footer navigation" className="site-footer__navigation">
          <section aria-labelledby="footer-story-heading" className="site-footer__group">
            <h2 id="footer-story-heading">Our Story</h2>
            <ul>
              {storyNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-visit-heading" className="site-footer__group">
            <h2 id="footer-visit-heading">Visit</h2>
            {operations ? (
              <address>
                <p>{operations.location.name}</p>
                <p>{[operations.location.addressLine1, operations.location.city].join(", ")}</p>
                <a href={`tel:${operations.contact.phoneE164}`}>
                  {operations.contact.phoneDisplay}
                </a>
                <a href={`mailto:${operations.contact.email}`}>{operations.contact.email}</a>
              </address>
            ) : null}
          </section>

          <section aria-labelledby="footer-reservations-heading" className="site-footer__group">
            <h2 id="footer-reservations-heading">Reservations</h2>
            <ul>
              {reservationNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-follow-heading" className="site-footer__group">
            <h2 id="footer-follow-heading">Follow</h2>
          </section>
        </nav>
      </div>
    </footer>
  );
}
