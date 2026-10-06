# Phase 10 — Private Dining / Contact / Operational Content

Status: **IN PROGRESS**

- [x] 10.0 Preflight and decisions
- [x] 10.1 Contracts and validation
- [ ] 10.2 Private Dining content pipeline
- [ ] 10.3 Operational public API
- [ ] 10.4 Private Event persistence
- [ ] 10.5 Private Event API
- [ ] 10.6 Private Dining frontend
- [ ] 10.7 Enquiry frontend
- [ ] 10.8 Contact frontend
- [ ] 10.9 Cross-site canonical operational content
- [ ] 10.10 Policies
- [ ] 10.11 Automated tests
- [ ] 10.12 Staging verification

## Exit criteria

- An enquiry is persisted through the approved workflow; notification delivery is downstream and cannot erase it.
- Contact data is canonical and consistent site-wide, once production values are confirmed.
- Opening hours use the operational database source.
- Active special closures affect reservation availability and public operational information consistently.
- Private Dining and Contact work on desktop and mobile.

## Preflight

On clean `main` at `61e49af`, `git pull --ff-only`, `pnpm.cmd install --frozen-lockfile`, `pnpm.cmd check`, and `pnpm.cmd test:e2e` passed. Playwright baseline: 23/23. Phase 9 is closed by owner attestation, as recorded in `docs/phase-9/`.

## Publication gates

`DEC-0022` remains open. Production location, email, phone, and directions must not be invented or published. An operational content document can be prepared as a draft while this remains open. Unresolved dress-code/cancellation policies remain drafts. Staging fixture data must be clearly labelled and never treated as production truth.
