import { reservationErrorCodes, type ReservationErrorCode } from "@ember-and-oak/types";

export type ReservationApiErrorCode = ReservationErrorCode | "REQUEST_ERROR";

export class ReservationApiError extends Error {
  constructor(
    public readonly code: ReservationApiErrorCode,
    public readonly status: number,
    public readonly requestId?: string,
  ) {
    super(messageForReservationError(code));
    this.name = "ReservationApiError";
  }
}

export function asReservationApiError(error: unknown): ReservationApiError {
  return error instanceof ReservationApiError ? error : new ReservationApiError("REQUEST_ERROR", 0);
}

export function parseReservationErrorCode(value: unknown): ReservationApiErrorCode {
  return typeof value === "string" && reservationErrorCodes.some((code) => code === value)
    ? (value as ReservationErrorCode)
    : "REQUEST_ERROR";
}

export function messageForReservationError(code: ReservationApiErrorCode): string {
  switch (code) {
    case "CLOSED":
      return "The restaurant is closed on this date.";
    case "SPECIAL_CLOSURE":
      return "Reservations are unavailable for this service.";
    case "OUTSIDE_BOOKING_WINDOW":
      return "Please select a date within the reservation window.";
    case "SAME_DAY_CUTOFF":
      return "Online booking for this service has closed.";
    case "PARTY_TOO_LARGE":
      return "For more than eight guests, please plan a Private Dining event.";
    case "NO_AVAILABILITY":
      return "No tables are available for this date.";
    case "SLOT_CONFLICT":
      return "That time is no longer available. Please choose another time.";
    case "IDEMPOTENCY_CONFLICT":
      return "Your reservation details changed. Please review and try again.";
    case "VALIDATION_ERROR":
      return "Please check your information and try again.";
    case "UNAUTHORIZED":
      return "This reservation request could not be authorized.";
    case "NOT_FOUND":
      return "The requested reservation could not be found.";
    case "INVALID_STATE_TRANSITION":
      return "This reservation can no longer be changed.";
    case "INTERNAL_ERROR":
    case "REQUEST_ERROR":
      return "We could not complete that request. Please try again.";
  }
}
