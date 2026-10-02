import type { Metadata } from "next";

import { PublicPageIntro } from "@/components/site/public-page-intro";

export const metadata: Metadata = { title: "Reservations" };

export default function ReservationsPage() {
  return (
    <PublicPageIntro label="Reservations" title="Reserve a Table">
      <p>
        The reservation destination is ready. Availability search and booking remain part of the
        Phase 9 reservation flow.
      </p>
    </PublicPageIntro>
  );
}
