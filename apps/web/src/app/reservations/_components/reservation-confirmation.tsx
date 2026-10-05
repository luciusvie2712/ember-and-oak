"use client";

import type { CreateReservationResult } from "@ember-and-oak/types";
import { useEffect, useRef } from "react";

import { formatReservationDate, formatReservationTime } from "../_lib/reservation-format";
import type { GuestDetails } from "./guest-details-form";

type Props = { result: CreateReservationResult; guest: GuestDetails };

export function ReservationConfirmation({ result, guest }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const reservation = result.reservation;

  return (
    <section className="reservation-confirmation" aria-labelledby="confirmation-heading">
      <h2 id="confirmation-heading" tabIndex={-1} ref={headingRef}>
        Your table is reserved.
      </h2>
      <p>Please keep your reservation code for your records.</p>
      <dl>
        <div>
          <dt>Reservation ID</dt>
          <dd>{reservation.reservationCode}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatReservationDate(reservation.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatReservationTime(reservation.startTime)}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{reservation.guestCount}</dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>
            {guest.email}
            <br />
            {guest.phone}
          </dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{guest.specialRequest.trim() || "None"}</dd>
        </div>
      </dl>
    </section>
  );
}
