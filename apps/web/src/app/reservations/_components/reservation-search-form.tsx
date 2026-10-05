"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { dateAfterDays, restaurantToday } from "../_lib/reservation-format";

export type ReservationSearchInput = { date: string; guestCount: number };

type Props = {
  value: ReservationSearchInput;
  onChange: (value: ReservationSearchInput) => void;
  onSearch: (value: ReservationSearchInput) => void;
  disabled?: boolean;
  error?: string;
};

export function ReservationSearchForm({
  value,
  onChange,
  onSearch,
  disabled = false,
  error,
}: Props) {
  const today = restaurantToday();
  const maxDate = dateAfterDays(today, 30);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.date || disabled) return;
    onSearch(value);
  }

  return (
    <form className="reservation-search" onSubmit={handleSubmit}>
      <div className="reservation-search__fields">
        <div className="reservation-field">
          <label htmlFor="reservation-date">Date</label>
          <input
            id="reservation-date"
            name="date"
            type="date"
            required
            min={today}
            max={maxDate}
            value={value.date}
            onChange={(event) => onChange({ ...value, date: event.target.value })}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reservation-search-error" : undefined}
            disabled={disabled}
          />
        </div>
        <div className="reservation-field">
          <label htmlFor="reservation-guests">Guests</label>
          <select
            id="reservation-guests"
            name="guests"
            value={value.guestCount}
            onChange={(event) => onChange({ ...value, guestCount: Number(event.target.value) })}
            disabled={disabled}
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error ? (
        <p id="reservation-search-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="reservation-search__actions">
        <button type="submit" disabled={disabled}>
          {disabled ? "Checking availability…" : "Find a Table"}
        </button>
        <p>
          More than 8 guests? <Link href="/private-dining">Plan a Private Dining event</Link>.
        </p>
      </div>
    </form>
  );
}
