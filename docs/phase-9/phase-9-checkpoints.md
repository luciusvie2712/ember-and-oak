# Phase 9 — Reservation Frontend & Confirmation

Status: **IN PROGRESS**

## Checkpoints

- [x] 9.0 Preflight and API contract
- [ ] 9.1 Reservation API client
- [ ] 9.2 Search form
- [ ] 9.3 Availability states
- [ ] 9.4 Slot selection
- [ ] 9.5 Guest details
- [ ] 9.6 Submission / idempotency / conflict recovery
- [ ] 9.7 Confirmation
- [ ] 9.8 Responsive and accessibility verification
- [ ] 9.9 Automated end-to-end tests
- [ ] 9.10 Staging verification

## Exit gate

A new guest can complete Landing → Reserve → Search → Select slot → Enter guest details → Submit → Receive confirmation on desktop and mobile.

## Preflight

On `main` at `5246d9db1c43c7c121b982db622ae4161075a52b`, `pnpm.cmd install --frozen-lockfile`, `pnpm.cmd check`, and `pnpm.cmd test:e2e` passed before Phase 9 implementation.
