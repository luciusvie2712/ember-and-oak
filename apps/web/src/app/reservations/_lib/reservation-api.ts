import type {
  AvailabilityResult,
  CreateReservationInput,
  CreateReservationResult,
} from "@ember-and-oak/types";

import { ReservationApiError, parseReservationErrorCode } from "./reservation-errors";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ReservationApiError("REQUEST_ERROR", response.status);
  }

  if (!response.ok) {
    const error =
      body && typeof body === "object" && "error" in body && body.error ? body.error : undefined;
    const details = error && typeof error === "object" ? error : undefined;
    const code =
      details && "code" in details ? parseReservationErrorCode(details.code) : "REQUEST_ERROR";
    const requestId =
      details && "requestId" in details && typeof details.requestId === "string"
        ? details.requestId
        : undefined;
    throw new ReservationApiError(code, response.status, requestId);
  }

  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new ReservationApiError("REQUEST_ERROR", response.status);
  }
  return body.data as T;
}

async function request<T>(url: URL, init: RequestInit): Promise<T> {
  try {
    return await parseResponse<T>(await fetch(url, { ...init, cache: "no-store" }));
  } catch (error) {
    if (
      error instanceof ReservationApiError ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }
    throw new ReservationApiError("REQUEST_ERROR", 0);
  }
}

export function searchAvailability(
  date: string,
  guestCount: number,
  signal?: AbortSignal,
): Promise<AvailabilityResult> {
  const url = new URL("/api/v1/reservations/availability", apiUrl);
  url.searchParams.set("date", date);
  url.searchParams.set("guests", String(guestCount));
  return request<AvailabilityResult>(url, {
    method: "GET",
    ...(signal ? { signal } : {}),
    headers: { accept: "application/json" },
  });
}

export function createReservation(
  input: CreateReservationInput,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<CreateReservationResult> {
  return request<CreateReservationResult>(new URL("/api/v1/reservations", apiUrl), {
    method: "POST",
    ...(signal ? { signal } : {}),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });
}
