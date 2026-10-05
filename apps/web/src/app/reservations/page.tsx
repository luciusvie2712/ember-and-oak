import type { Metadata } from "next";

import { ReservationFlow } from "./_components/reservation-flow";

import "./reservation.css";

export const metadata: Metadata = { title: "Reservations" };

export default function ReservationsPage() {
  return (
    <section className="reservation-page">
      <header className="reservation-page__intro">
        <p className="section-label">Reservations</p>
        <h1>Reserve a Table</h1>
        <p>Select your preferred date and party size to view available times.</p>
      </header>
      <ReservationFlow />
    </section>
  );
}
