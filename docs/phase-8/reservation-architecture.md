# Phase 8 Reservation Architecture

Status: **IMPLEMENTED LOCALLY — STAGING VERIFICATION PENDING**

## Canonical contracts

Reservation, customer, availability, operating-hours, capacity, and stable error contracts live under `packages/types/src/reservation`. Zod request validation lives under `packages/validation/src/reservation`. HTTP and database shapes map into these contracts; consumers do not depend on PostgreSQL rows.

## Business time

- Restaurant timezone: `Asia/Ho_Chi_Minh`.
- Reservation dates and wall-clock times are restaurant-local strings.
- Technical timestamps use `timestamptz`/UTC.
- Slot interval: 30 minutes.
- Occupancy duration: 120 minutes.
- Closing time is service-end; the final slot must finish by close.
- Overlap is half-open: `existingStart < requestedEnd && requestedStart < existingEnd`.
- Booking window is local today through local today + 30 calendar days, inclusive.
- Same-day lead time is at least 120 minutes.

## Persistence model

Migration `002_phase_8_reservation` creates:

- `customers`
- `reservations`
- `opening_hours`
- `special_closures`
- `service_capacities`
- `dining_tables` and `reservation_tables` for later manual assignment
- `reservation_idempotency`

Opening hours are seeded from the source-confirmed schedule. Capacity is deliberately not seeded because production capacity is operational data. Integration/staging may supply an explicitly labelled fixture.

## Lifecycle

Public creation commits as `CONFIRMED`. The central state machine permits:

```text
PENDING   -> CONFIRMED | CANCELLED
CONFIRMED -> SEATED | CANCELLED | NO_SHOW
SEATED    -> COMPLETED
```

`COMPLETED`, `CANCELLED`, and `NO_SHOW` are terminal in the normal workflow. Only `PENDING`, `CONFIRMED`, and `SEATED` consume capacity.

## Availability

The engine loads opening hours, closures, capacity, and capacity-consuming reservations through repositories. It then generates service-end-safe candidate slots, applies the same-day cutoff and closures, and calculates remaining aggregate covers for every half-open occupancy window.

Search and create call the same `AvailabilityService`; create passes its transaction client so revalidation sees the authoritative transaction state.

## Concurrency and idempotency

Creation runs in one PostgreSQL transaction:

1. Acquire an advisory transaction lock for the idempotency key.
2. Replay the existing reservation for the same key/hash, or reject a changed hash.
3. Insert a bounded 24-hour idempotency record.
4. Acquire an advisory transaction lock keyed by restaurant-local service date.
5. Re-run availability inside the transaction.
6. Insert customer and reservation atomically.
7. Attach the reservation to the idempotency record and commit.

Date-level locking is conservative but correct for overlapping starts such as 18:00 and 18:30. Reservation-code uniqueness is enforced by PostgreSQL and collision attempts use savepoints.

## Public API

```http
GET /api/v1/reservations/availability?date=YYYY-MM-DD&guests=2
POST /api/v1/reservations
Idempotency-Key: <opaque 8–128 character key>
```

The create response exposes a non-PII reservation summary. Domain errors map to stable 400/409/404/500 responses. Normal request logging records method, path, request ID, status, and duration; it does not log request bodies, guest PII, or secrets.

## Scope boundary

Guest self-service cancellation and full admin reservation operations remain outside Phase 8 because their product rules belong to later phases. Dining-table records support later manual assignment but never participate in MVP public availability.
