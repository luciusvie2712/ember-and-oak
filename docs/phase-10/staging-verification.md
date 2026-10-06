# Phase 10 Staging Verification

Status: **PENDING**

Do not mark Phase 10 closed from local tests or URL-only smoke checks. Record the deployed revision, timestamp, staging URLs, sanitized outcomes, and database/provider evidence.

## Private Dining

- [ ] Published content and three source-backed experiences visible
- [ ] Media and responsive desktop/mobile layout verified

## Event enquiry

- [ ] Client and server validation
- [ ] Successful browser submission creates one persisted enquiry
- [ ] Same-key replay and changed-body conflict
- [ ] Network/provider failure cannot lose a committed enquiry
- [ ] No PII in logs or analytics

## Operational content and Contact

- [ ] Confirmed contact and location are consistent on Home, Footer, Contact, and reservation confirmation
- [ ] Contact opening hours match `opening_hours`
- [ ] Active special closure is public without internal reason and blocks matching reservation slots
- [ ] Only approved published policies appear
- [ ] Keyboard, focus, and responsive widths 375/430/768/1024/1440 px pass

Production publication remains gated by `DEC-0022` and any other unresolved business policy decisions.

## Direct observations — 2026-10-06 04:26 UTC

- CI for `8086ba0e95f05254c81aac8acbd5b08cbd0f3d02` completed successfully: [run 37413259398](https://github.com/luciusvie2712/ember-and-oak/actions/runs/37413259398). The deployment hooks and URL smoke check do not prove the deployed revision or guest journeys.
- Staging API `https://ember-and-oak-api-staging-kxw3.onrender.com/api/v1/content/private-dining/private-dining` returned HTTP 200 with published content. Staging web `https://ember-and-oak-web.vercel.app/private-dining` returned HTTP 200 but rendered its unavailable-content fallback, not the experiences or enquiry form. Home and Menu also rendered content fallbacks. The likely server-side API environment/configuration fault is not yet proven because the Vercel environment is not visible from this repository.
- A clearly labelled synthetic enquiry sent directly to staging API `POST /api/v1/private-event-enquiries` returned 201 and receipt `c6a02f0b-632a-46e5-b61d-85a4ba7cdd6e`. Same key/body returned 201 with the same receipt; same key/changed body returned 409 `IDEMPOTENCY_CONFLICT`. This proves API-level replay behavior, not a browser submission or a direct database row count. No actual guest data was used.
- Browser preflight from `https://ember-and-oak-web.vercel.app` to that POST endpoint returned HTTP 204 but **no `Access-Control-Allow-Origin` header**. A browser cannot submit the cross-origin enquiry until the staging API `CORS_ORIGINS` includes the web origin and the API is redeployed.
- `https://ember-and-oak-web.vercel.app/contact` returned HTTP 200 with the verified-details-pending fallback. `GET /api/v1/operations` returned HTTP 404, expected while production location/contact remain unconfirmed and no operational document is published. Do not replace this with invented values.

## Actions required before 10.12 can pass

1. In the Vercel staging web project, verify `CONTENT_API_URL` and `NEXT_PUBLIC_API_URL` point to `https://ember-and-oak-api-staging-kxw3.onrender.com/`; redeploy, then confirm Private Dining's three experiences and enquiry form render from published content. Check the actually deployed commit rather than relying on URL-only smoke.
2. In the Render staging API service, include `https://ember-and-oak-web.vercel.app` in `CORS_ORIGINS`; redeploy and repeat the enquiry POST preflight and an actual browser submission.
3. Confirm the official address, email, phone, directions URL, and policy text with the project owner. Until then, keep Operations unpublished and `DEC-0022` open. After approval, create/publish the canonical Operations document through Admin and verify Contact/Home/Footer and reservation surfaces.
4. Collect direct staging database evidence for migration `003_phase_10_operational`, the enquiry row and duplicate count, opening-hours consistency, closure-to-availability behavior, and PII-free logs. Test responsive and keyboard flows in the deployed browser. Record fixture cleanup/retention.

These observations are partial staging evidence, **not** Phase 10 staging verification or closure.
