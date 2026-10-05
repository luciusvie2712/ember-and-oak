import Link from "next/link";
import type { AvailabilityResult } from "@ember-and-oak/types";
import type { ReactNode } from "react";

import { ReservationApiError } from "../_lib/reservation-errors";

type Props = {
  result: AvailabilityResult | null;
  loading: boolean;
  error: ReservationApiError | null;
  onRetry: () => void;
  children?: ReactNode;
};

export function AvailabilityResults({ result, loading, error, onRetry, children }: Props) {
  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Checking availability…
      </p>
    );
  }

  if (error) {
    return (
      <div className="reservation-notice" role="alert">
        <p>{error.message}</p>
        {error.code === "PARTY_TOO_LARGE" ? (
          <Link href="/private-dining">Explore Private Dining</Link>
        ) : null}
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!result) return null;

  if (result.status === "CLOSED") {
    return (
      <p className="reservation-notice" role="status">
        The restaurant is closed on this date. Please choose another date.
      </p>
    );
  }
  if (result.status === "SPECIAL_CLOSURE") {
    return (
      <p className="reservation-notice" role="status">
        Reservations are unavailable for this service. Please choose another date.
      </p>
    );
  }
  if (result.status === "NO_AVAILABILITY" || !result.slots.some((slot) => slot.available)) {
    return (
      <p className="reservation-notice" role="status">
        No tables are available for this date. Try another date or party size.
      </p>
    );
  }

  return (
    <section className="reservation-availability" aria-label="Available reservation times">
      {children}
    </section>
  );
}
