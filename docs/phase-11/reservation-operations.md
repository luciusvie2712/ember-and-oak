# Reservation operations

The daily list is bounded to 50 records by default and 100 maximum, with date, status, guest-count
and guest/contact/code search filters. Detail includes guest contact, requests, internal notes,
assigned tables and immutable status history.

Status mutation locks the row with `SELECT ... FOR UPDATE`, checks `expectedStatus`, reuses the
Phase 8 state machine, updates the reservation and appends a status event in one transaction.
Cancellation requires a reason up to 500 characters and sets `cancelled_at`; committed cancelled
reservations immediately stop consuming availability capacity.

Internal notes appear only in protected admin endpoints and must never enter public responses,
analytics or request logs.
