"use client";

export default function ReservationsError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section className="reservation-page" role="alert">
      <h1>Reservations are temporarily unavailable</h1>
      <p>Please try loading the reservation page again.</p>
      <button type="button" onClick={retry}>
        Try again
      </button>
    </section>
  );
}
