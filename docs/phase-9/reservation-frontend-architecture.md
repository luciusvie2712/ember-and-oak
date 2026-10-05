# Phase 9 Reservation Frontend Architecture

## Authority

The Phase 8 API remains the authority for availability, booking window, same-day cutoff, special closures, capacity, final slot validity, idempotency, and concurrency. The frontend provides UX validation and state management only.

## Flow

SEARCH → SEARCHING → AVAILABILITY → GUEST_DETAILS → SUBMITTING → CONFIRMED.

Recoverable transitions include SEARCHING → ERROR → SEARCH and SUBMITTING → SLOT_CONFLICT → refreshed AVAILABILITY. Guest fields are preserved on a stale-slot conflict.

## API

- `GET /api/v1/reservations/availability`
- `POST /api/v1/reservations` with `Idempotency-Key`

Network retry uses the same body and key. Any material change to date, slot, guest count, guest details, or special request starts a new logical request with a new key.

## Privacy

Guest name, email, phone, special request, and reservation code must not be sent to analytics. The browser does not send email or perform payment work.
