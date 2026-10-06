"use client";

import type { CreatePrivateEventEnquiryInput } from "@ember-and-oak/types";
import { privateEventEnquirySchema } from "@ember-and-oak/validation";
import { useRef, useState, type FormEvent } from "react";

import {
  PrivateEventApiError,
  submitPrivateEventEnquiry,
} from "@/lib/private-event/private-event-api";
import {
  keyForEnquiry,
  type LogicalEnquiryAttempt,
} from "@/lib/private-event/private-event-idempotency";

type Field = keyof CreatePrivateEventEnquiryInput;
type FormValues = Record<Field, string>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guests: "",
  eventType: "",
  budget: "",
  message: "",
};

const fields: readonly Readonly<{
  name: Field;
  label: string;
  type?: string;
  autocomplete?: string;
}>[] = [
  { name: "name", label: "Name", autocomplete: "name" },
  { name: "email", label: "Email", type: "email", autocomplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autocomplete: "tel" },
  { name: "eventDate", label: "Event Date", type: "date" },
  { name: "guests", label: "Guests", type: "number" },
  { name: "eventType", label: "Event Type" },
  { name: "budget", label: "Budget (optional)" },
];

export function PrivateEventEnquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<
    "DEFAULT" | "SUBMITTING" | "SUCCESS" | "SERVER_ERROR" | "NETWORK_ERROR"
  >("DEFAULT");
  const [errorMessage, setErrorMessage] = useState("");
  const pending = useRef(false);
  const attempt = useRef<LogicalEnquiryAttempt | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  function update(name: Field, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status !== "SUBMITTING") setStatus("DEFAULT");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const parsed = privateEventEnquirySchema.safeParse({
      ...values,
      guests: Number(values.guests),
      budget: values.budget || undefined,
      message: values.message || undefined,
    });
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setErrors(next);
      setErrorMessage("Please correct the highlighted fields.");
      requestAnimationFrame(() =>
        document.getElementById(`enquiry-${String(parsed.error.issues[0]?.path[0])}`)?.focus(),
      );
      return;
    }
    pending.current = true;
    setStatus("SUBMITTING");
    setErrorMessage("");
    const payload = JSON.stringify(parsed.data);
    attempt.current = keyForEnquiry(attempt.current, payload);
    try {
      await submitPrivateEventEnquiry(parsed.data, attempt.current.key);
      setStatus("SUCCESS");
      requestAnimationFrame(() => successHeading.current?.focus());
    } catch (error) {
      if (error instanceof PrivateEventApiError && error.status === 0) {
        setStatus("NETWORK_ERROR");
        setErrorMessage("We could not connect. Please retry; your details are still here.");
      } else {
        setStatus("SERVER_ERROR");
        setErrorMessage(
          error instanceof PrivateEventApiError && error.code === "VALIDATION_ERROR"
            ? "Please review your details and try again."
            : "We could not receive your enquiry right now. Please try again.",
        );
      }
    } finally {
      pending.current = false;
    }
  }

  if (status === "SUCCESS") {
    return (
      <div className="enquiry-success" role="status">
        <h3 ref={successHeading} tabIndex={-1}>
          Thank you.
        </h3>
        <p>We’ve received your private dining enquiry. Our team will follow up with you.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" noValidate onSubmit={(event) => void submit(event)}>
      {errorMessage ? (
        <p className="enquiry-form__summary" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div className="enquiry-form__grid">
        {fields.map((field) => (
          <div className="enquiry-form__field" key={field.name}>
            <label htmlFor={`enquiry-${field.name}`}>{field.label}</label>
            <input
              id={`enquiry-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autocomplete}
              min={field.name === "guests" ? 1 : undefined}
              max={field.name === "guests" ? 500 : undefined}
              value={values[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `enquiry-${field.name}-error` : undefined}
              disabled={status === "SUBMITTING"}
            />
            {errors[field.name] ? (
              <p id={`enquiry-${field.name}-error`}>{errors[field.name]}</p>
            ) : null}
          </div>
        ))}
        <div className="enquiry-form__field enquiry-form__field--wide">
          <label htmlFor="enquiry-message">Message (optional)</label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "enquiry-message-error" : undefined}
            disabled={status === "SUBMITTING"}
          />
          {errors.message ? <p id="enquiry-message-error">{errors.message}</p> : null}
        </div>
      </div>
      <button type="submit" disabled={status === "SUBMITTING"}>
        {status === "SUBMITTING" ? "Sending enquiry…" : "Send Enquiry"}
      </button>
    </form>
  );
}
