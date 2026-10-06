# Phase 9 Staging Verification

Status: **CLOSED — owner-verified on 2026-10-06**

The project owner confirmed that the Phase 9.10 staging checks below were completed and requested Phase 9 closure on 2026-10-06. The detailed staging run artifacts, database records, and provider logs were not supplied to this repository. The checks below are therefore owner-attested, not independently verified here. The earlier directly observed issues remain recorded for traceability and should be rechecked if staging behavior regresses.

## Directly observed on 2026-10-06 (10:05 ICT)

- CI `main` revision: `0a66d5bc02586e81e155bb3ce48b2ead5e0ac207`. [GitHub Actions run 37293294054](https://github.com/luciusvie2712/ember-and-oak/actions/runs/37293294054) passed quality, integration, E2E, and deploy/smoke jobs. The staging smoke job checks reachability only, not the reservation journey or the actual deployed revision.
- Web `https://ember-and-oak-web.vercel.app/reservations` returned HTTP 200. A headless browser search on that page attempted `http://localhost:4000/api/v1/reservations/availability?...`, failed with `net::ERR_FAILED`, and showed the safe request-error message. At that time, the deployed client did not have a usable `NEXT_PUBLIC_API_URL`.
- API `https://ember-and-oak-api-staging-kxw3.onrender.com/api/v1/reservations/availability?date=2026-10-13&guests=2` returned HTTP 200 with `timezone: Asia/Ho_Chi_Minh`, `status: NO_AVAILABILITY`, and no slots. With `Origin: https://ember-and-oak-web.vercel.app`, the response did not include `Access-Control-Allow-Origin`, so browser access from the web origin was not allowed at that time.
- Read-only availability checks for 2026-10-07 through 2026-10-13 returned no slots (`NO_AVAILABILITY`, except `CLOSED` on 2026-10-12). This is consistent with the staging-only capacity fixture having been removed; database capacity was not directly inspected.

## Earlier deployment issues to recheck if staging regresses

1. In the Vercel project serving the staging web URL, set `NEXT_PUBLIC_API_URL=https://ember-and-oak-api-staging-kxw3.onrender.com` for the relevant deployment environment and redeploy the web project. Confirm the browser requests this API URL, not `localhost`.
2. In the Render staging API service, include `https://ember-and-oak-web.vercel.app` in `CORS_ORIGINS` and redeploy. Confirm an availability response to that `Origin` includes the matching `Access-Control-Allow-Origin`; test POST preflight as well.
3. Arrange an explicitly labelled staging-only capacity fixture for a future open day, following the Phase 8 staging data policy. Record the capacity and cleanup/retention decision without publishing database credentials. No live booking POST was attempted while no slot was available.
4. If reproducing these earlier observations, re-run the checklist below on desktop and mobile against the live browser → API → database path and retain the deployed revision, timestamp, sanitized outcomes, and database/log evidence.

## Reservation flow

- [x] Landing → Reserve → Search → Select slot → Guest details → Submit → Confirmation on desktop and mobile
- [x] Exactly one database reservation for a successful logical request and rapid duplicate submission
- [x] Closed, fully booked, invalid input, large party, and server-error states
- [x] Stale-slot conflict refreshes availability while retaining guest fields
- [x] Network retry keeps the same idempotency key and does not duplicate a booking

## Quality

- [x] Widths 375, 430, 768, 1024, and 1440 px
- [x] Keyboard-only journey, focus, field errors, loading announcement, and confirmation focus
- [x] No PII in analytics or logs; no secret in browser output
- [x] API remains final authority for availability and booking
