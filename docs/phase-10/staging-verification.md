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
