"use client";

import { createReservationSchema } from "@ember-and-oak/validation";
import { useRef, useState, type FormEvent } from "react";

import { ReservationErrorSummary } from "./reservation-error-summary";

export type GuestDetails = { name: string; email: string; phone: string; specialRequest: string };
type GuestField = keyof GuestDetails;
type FieldError = { id: string; label: string; message: string };

type Props = {
  value: GuestDetails;
  onChange: (value: GuestDetails) => void;
  onSubmit: () => void;
  date: string;
  startTime: string;
  guestCount: number;
  submitting: boolean;
  serverError?: string | null;
};

const fields: Record<GuestField, { id: string; label: string }> = {
  name: { id: "reservation-name", label: "Name" },
  email: { id: "reservation-email", label: "Email" },
  phone: { id: "reservation-phone", label: "Phone" },
  specialRequest: { id: "reservation-special-request", label: "Special request" },
};

export function GuestDetailsForm({
  value,
  onChange,
  onSubmit,
  date,
  startTime,
  guestCount,
  submitting,
  serverError,
}: Props) {
  const [errors, setErrors] = useState<Partial<Record<GuestField, string>>>({});
  const inputRefs = useRef<
    Partial<Record<GuestField, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  function update(field: GuestField, next: string) {
    onChange({ ...value, [field]: next });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const parsed = createReservationSchema.safeParse({
      date,
      startTime,
      guestCount,
      guest: { name: value.name, email: value.email, phone: value.phone },
      ...(value.specialRequest.trim() ? { specialRequest: value.specialRequest } : {}),
    });
    if (!parsed.success) {
      const nextErrors: Partial<Record<GuestField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] === "guest" ? issue.path[1] : issue.path[0];
        if (typeof field === "string" && field in fields && !nextErrors[field as GuestField]) {
          nextErrors[field as GuestField] = issue.message;
        }
      }
      setErrors(nextErrors);
      const first = (Object.keys(fields) as GuestField[]).find((field) => nextErrors[field]);
      if (first) requestAnimationFrame(() => inputRefs.current[first]?.focus());
      return;
    }
    setErrors({});
    onSubmit();
  }

  const errorList: FieldError[] = (Object.keys(fields) as GuestField[])
    .filter((field) => Boolean(errors[field]))
    .map((field) => ({ ...fields[field], message: errors[field]! }));

  return (
    <form className="reservation-guest-form" noValidate onSubmit={handleSubmit}>
      <h2>Guest information</h2>
      <ReservationErrorSummary errors={errorList} />
      {serverError ? (
        <p className="reservation-notice" role="alert">
          {serverError}
        </p>
      ) : null}
      <div className="reservation-field">
        <label htmlFor={fields.name.id}>Name</label>
        <input
          id={fields.name.id}
          ref={(node) => {
            inputRefs.current.name = node;
          }}
          name="name"
          autoComplete="name"
          value={value.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "reservation-name-error" : undefined}
          disabled={submitting}
        />
        {errors.name ? <p id="reservation-name-error">{errors.name}</p> : null}
      </div>
      <div className="reservation-field">
        <label htmlFor={fields.email.id}>Email</label>
        <input
          id={fields.email.id}
          ref={(node) => {
            inputRefs.current.email = node;
          }}
          name="email"
          type="email"
          autoComplete="email"
          value={value.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "reservation-email-error" : undefined}
          disabled={submitting}
        />
        {errors.email ? <p id="reservation-email-error">{errors.email}</p> : null}
      </div>
      <div className="reservation-field">
        <label htmlFor={fields.phone.id}>Phone</label>
        <input
          id={fields.phone.id}
          ref={(node) => {
            inputRefs.current.phone = node;
          }}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+84900000000"
          value={value.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "reservation-phone-error" : undefined}
          disabled={submitting}
        />
        {errors.phone ? <p id="reservation-phone-error">{errors.phone}</p> : null}
      </div>
      <div className="reservation-field">
        <label htmlFor={fields.specialRequest.id}>Special request (optional)</label>
        <textarea
          id={fields.specialRequest.id}
          ref={(node) => {
            inputRefs.current.specialRequest = node;
          }}
          name="specialRequest"
          maxLength={1000}
          value={value.specialRequest}
          onChange={(event) => update("specialRequest", event.target.value)}
          aria-invalid={Boolean(errors.specialRequest)}
          aria-describedby={errors.specialRequest ? "reservation-special-request-error" : undefined}
          disabled={submitting}
        />
        {errors.specialRequest ? (
          <p id="reservation-special-request-error">{errors.specialRequest}</p>
        ) : null}
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Reserving…" : "Reserve Table"}
      </button>
    </form>
  );
}
