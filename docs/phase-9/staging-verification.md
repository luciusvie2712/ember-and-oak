# Phase 9 Staging Verification

Status: **PENDING**

Record the deployed `main` SHA, staging URLs, time of verification, and sanitized outcomes. Do not mark the phase closed until the full reservation journey and failure/recovery checks pass on staging.

## Reservation flow

- [ ] Landing → Reserve → Search → Select slot → Guest details → Submit → Confirmation on desktop and mobile
- [ ] Exactly one database reservation for a successful logical request and rapid duplicate submission
- [ ] Closed, fully booked, invalid input, large party, and server-error states
- [ ] Stale-slot conflict refreshes availability while retaining guest fields
- [ ] Network retry keeps the same idempotency key and does not duplicate a booking

## Quality

- [ ] Widths 375, 430, 768, 1024, and 1440 px
- [ ] Keyboard-only journey, focus, field errors, loading announcement, and confirmation focus
- [ ] No PII in analytics or logs; no secret in browser output
- [ ] API remains final authority for availability and booking
