# EMBER & OAK — PHASE 0 BUSINESS RULES

Status: **PHASE 8 BUSINESS-RULE FREEZE — APPROVED**

Authoritative Phase 8 decisions are recorded as DEC-0026 through DEC-0037 in
`decision-log.md`. Those confirmed decisions supersede older proposal/open labels
retained in this working baseline. The implementation values are: single location,
`Asia/Ho_Chi_Minh`, `CONFIRMED` online creation, 30-minute slots, 120-minute
duration, 1–8 guests, an inclusive 30-day booking window, a 120-minute same-day
cutoff, service-end closing semantics, zero turn buffer, `CAPACITY_FIRST`, manual
table assignment, and full/partial special closures.

This document is the working business-rule baseline for the Ember & Oak MVP.

It distinguishes:

- **CONFIRMED FROM SOURCE** — explicitly supported by approved project/source material.
- **CONFIRMED AS ENGINEERING RULE** — implementation invariant required for correctness and already established by the project architecture.
- **PROPOSED / NEEDS CONFIRMATION** — recommended MVP value that must not be treated as final business truth until approved.
- **OPEN** — unresolved decision that blocks a dependent production rule or implementation area.

No `OPEN` or `PROPOSED / NEEDS CONFIRMATION` value may be silently hard-coded as production business truth.

---

## 1. Restaurant model

| Rule | Value | Status |
|---|---|---|
| Location model | Single-location MVP | PROPOSED / NEEDS CONFIRMATION |
| Address | 41/22 Pham Ngu Lao, Phuong Hanh Thong, Tp.HCM | CONFIRMED FROM SOURCE |
| Currency | VND | PROPOSED / NEEDS CONFIRMATION |
| Restaurant timezone | `Asia/Ho_Chi_Minh` | PROPOSED / NEEDS CONFIRMATION |
| Primary language | Vietnamese | PROPOSED / NEEDS CONFIRMATION |
| Multi-language | English | PROPOSED / DEFERRED |
| Production contact data | Pending verification | OPEN |

### 1.1. Timezone rule

Reservation business dates and wall-clock times must be interpreted in the restaurant timezone.

Proposed MVP timezone:

```text
Asia/Ho_Chi_Minh
```

Technical timestamps such as:

```text
createdAt
updatedAt
cancelledAt
publishedAt
```

must be stored as UTC timestamps / `timestamptz` where applicable.

The client/browser timezone must never determine restaurant availability.

### 1.2. Address/contact consistency

The current source contains an address in Ho Chi Minh City while older contact examples include US-formatted contact information.

Therefore:

- the Ho Chi Minh City address may be used as the current source-backed location reference;
- phone/email values must not be treated as production operational truth until DEC-0022 is confirmed;
- structured data, confirmation email, Add to Calendar, Contact page, and production footer must not publish conflicting location/contact facts.

---

## 2. Opening hours

Baseline:

```text
TUESDAY — THURSDAY
17:30 — 22:30

FRIDAY — SATURDAY
17:30 — 23:30

SUNDAY
17:00 — 22:00

MONDAY
Closed
```

Status: **CONFIRMED FROM SOURCE**

### 2.1. Operational rule

Opening hours are operational data.

The availability engine must load opening hours from a canonical data source.

Do not hard-code logic such as:

```text
if Monday => closed
```

inside UI or availability-domain code.

### 2.2. Closing-time semantics

Status: **OPEN / MUST BE CONFIRMED BEFORE FINAL AVAILABILITY IMPLEMENTATION**

`closeTime` must have one explicit meaning.

Choose one:

**Option A — Service-end time**

A reservation must finish no later than `closeTime`.

Example:

```text
openTime = 17:30
closeTime = 22:30
duration = 120 minutes
buffer = 0

latest valid start = 20:30
```

**Option B — Last-seating time**

A reservation may start up to `closeTime`, even when its dining period extends later.

Recommended MVP interpretation: **Option A — Service-end time**, unless restaurant operations confirm otherwise.

---

## 3. Reservation status model

Statuses:

```text
PENDING
CONFIRMED
SEATED
COMPLETED
CANCELLED
NO_SHOW
```

Status set: **CONFIRMED**

### 3.1. Allowed transitions

Status: **PROPOSED / NEEDS CONFIRMATION**

```text
PENDING   -> CONFIRMED
PENDING   -> CANCELLED

CONFIRMED -> SEATED
CONFIRMED -> CANCELLED
CONFIRMED -> NO_SHOW

SEATED    -> COMPLETED
```

### 3.2. Terminal states

Proposed normal-workflow terminal states:

```text
COMPLETED
CANCELLED
NO_SHOW
```

Normal reservation APIs must not transition out of a terminal state.

Forbidden examples:

```text
COMPLETED -> PENDING
CANCELLED -> SEATED
NO_SHOW   -> CONFIRMED
```

If operations later require reopening/recovery, use an explicit privileged operation with an audit trail instead of arbitrary status mutation.

---

## 4. Reservation creation semantics

### 4.1. Initial online reservation status

Status: **PROPOSED / NEEDS CONFIRMATION**

Recommended MVP rule:

```text
A successful regular online reservation is created as CONFIRMED.
```

Meaning:

```text
server validates input
    ↓
server re-checks availability
    ↓
transaction/concurrency protection succeeds
    ↓
reservation commit succeeds
    ↓
status = CONFIRMED
    ↓
confirmation may be shown
```

`PENDING` should be reserved for workflows that explicitly require staff review or later operational approval.

If restaurant operations require manual approval for every online request, this rule must be changed before Phase 8.1.

### 4.2. Confirmation authority

A confirmation screen or confirmation email must not be produced before the reservation transaction successfully commits.

Status: **CONFIRMED AS ENGINEERING RULE**

---

## 5. Capacity-consuming reservation statuses

Status: **PROPOSED / MUST BE FROZEN WITH THE STATE MACHINE**

Recommended MVP behavior:

The following statuses consume reservation availability:

```text
PENDING
CONFIRMED
SEATED
```

The following statuses do not consume future availability:

```text
CANCELLED
COMPLETED
NO_SHOW
```

When a reservation becomes `CANCELLED`, its capacity must immediately be released for future availability calculations.

`COMPLETED` and `NO_SHOW` do not consume future slots.

---

## 6. Reservation slot policy

| Rule | Proposed value | Status |
|---|---:|---|
| Slot interval | 30 minutes | PROPOSED |
| Standard dining duration | 120 minutes | OPEN / PROPOSED |
| Online guest min | 1 | PROPOSED |
| Online guest max | 8 | PROPOSED |
| Parties > 8 | Route to Private Dining / contact | PROPOSED |
| Booking window | 30 restaurant-local calendar days | OPEN / PROPOSED |
| Same-day cutoff | 120 minutes before requested slot | OPEN / PROPOSED |
| Grace period for arrival | 15 minutes | OPEN / PROPOSED |
| Buffer between turns | 0 minutes for MVP | PROPOSED / NEEDS CONFIRMATION |

### 6.1. Slot interval

Proposed:

```text
30 minutes
```

Example candidate starts:

```text
17:30
18:00
18:30
19:00
19:30
...
```

The slot interval is not the same as reservation duration.

### 6.2. Standard dining duration

Proposed:

```text
120 minutes
```

Example:

```text
start = 19:00
duration = 120 minutes

occupancy window = 19:00–21:00
```

Recommended MVP rule:

- one standard duration for regular online reservations;
- guest count does not automatically change the duration;
- per-reservation duration override is not part of the normal public booking flow unless operations explicitly require it.

### 6.3. Arrival grace period

Proposed:

```text
15 minutes
```

Grace period is an operational arrival policy.

Unless separately confirmed, it does **not** extend the reservation occupancy window and must not silently turn:

```text
120 minutes
```

into:

```text
135 minutes
```

for availability calculation.

### 6.4. Turn buffer

Recommended MVP:

```text
0 minutes
```

If restaurant operations later require a reset/cleaning buffer between turns, create a confirmed operational rule and include it in availability overlap calculation.

---

## 7. Regular online guest range

Status: **PROPOSED / NEEDS CONFIRMATION**

Recommended MVP:

```text
minimum guests = 1
maximum guests = 8
```

Behavior:

```text
guestCount < 1
→ INVALID_GUEST_COUNT

guestCount > 8
→ PARTY_TOO_LARGE_FOR_REGULAR_RESERVATION
→ direct user to Private Dining / contact
```

Rationale:

- source examples show Chef's Table around 6–8 guests;
- Private Room is positioned for larger groups;
- the source does not explicitly define the normal online reservation maximum.

Therefore `1–8` must remain a proposal until approved.

---

## 8. Booking window

Status: **OPEN / PROPOSED**

Recommended MVP:

```text
30 restaurant-local calendar days
```

Precise proposed semantics:

```text
allowed dates:
restaurant-local current date
through
restaurant-local current date + 30 calendar days
```

The exact inclusive/exclusive convention must be confirmed before final validation tests are locked.

Availability must reject:

- past restaurant-local dates;
- dates beyond the confirmed advance-booking window.

---

## 9. Same-day cutoff

Status: **OPEN / PROPOSED**

Recommended MVP:

```text
120 minutes before requested slot
```

Proposed rule:

```text
slotStart - restaurantCurrentTime >= 120 minutes
→ eligible for further availability checks

slotStart - restaurantCurrentTime < 120 minutes
→ rejected by same-day cutoff
```

All calculations use the restaurant timezone.

---

## 10. Availability model

Status: **OPEN / PHASE 8 BLOCKER**

One model must be selected before final schema/domain implementation.

### Model A — Table-aware availability

- Every usable table is modeled.
- Availability requires a suitable table or table combination.
- Reservation/table overlap is part of booking feasibility.
- More accurate to physical floor operations.
- More complex concurrency and table-combination logic.

### Model B — Service-capacity-first

- Availability is based on aggregate service/slot cover capacity.
- Host/admin assigns tables manually after booking.
- Public availability does not require automatic table optimization.
- Lower MVP complexity.

### Recommended MVP

```text
Availability model = CAPACITY_FIRST
Table assignment = MANUAL
Automated table optimization = DEFERRED
```

This recommendation is an engineering/MVP-complexity choice, not a source-confirmed business fact.

---

## 11. Service capacity

Applicable if `CAPACITY_FIRST` is selected.

Status: **PRODUCTION VALUE PENDING OPERATIONAL INPUT**

The system must not invent a production cover capacity.

Service capacity must be operational data/configuration.

Example test fixture only:

```text
capacity = 20 covers
```

The value above is not production truth.

The architecture must allow capacity to be changed without rewriting the availability algorithm.

Possible future operational dimensions include:

- day-of-week;
- service period;
- exceptional date;
- special event;
- temporary capacity override.

Phase 8 should implement only the minimum model required by the confirmed MVP rules.

---

## 12. Availability calculation

Availability must consider, in this order or equivalent deterministic logic:

1. Restaurant timezone.
2. Opening hours.
3. Special closures.
4. Requested restaurant-local date.
5. Booking window.
6. Same-day cutoff.
7. Requested guest count.
8. Slot interval.
9. Reservation duration.
10. Turn buffer if enabled.
11. Existing capacity-consuming reservations.
12. Capacity/table feasibility according to the confirmed availability model.

### 12.1. Server authority

Frontend availability is advisory only.

When creating a reservation:

1. Server validates all input.
2. Server re-checks availability using the same domain rules as the search endpoint.
3. Server executes the critical booking mutation in a database transaction.
4. Server applies the selected locking/concurrency strategy.
5. Server protects against duplicate/retried submissions.
6. Server returns confirmation only after successful commit.

Status: **CONFIRMED AS ENGINEERING RULE**

### 12.2. Shared rule requirement

Availability search and reservation creation must use the same business-rule implementation.

Do not maintain separate copies of:

```text
opening-hour logic
cutoff logic
guest validation
capacity calculation
overlap calculation
```

across endpoints.

---

## 13. Reservation occupancy and overlap semantics

Status: **PROPOSED ENGINEERING RULE**

Use half-open occupancy intervals:

```text
[start, end)
```

Two occupancy windows overlap when:

```text
existingStart < requestedEnd
AND
requestedStart < existingEnd
```

Example:

```text
Reservation A: 18:00–20:00
Reservation B: 20:00–22:00
```

With a zero-minute turn buffer, these do not overlap.

If a non-zero turn buffer is later confirmed, it must be applied consistently before the overlap calculation.

---

## 14. Special closures

Status: **PROPOSED FOR MVP / SHOULD BE CONFIRMED**

Special closures override normal opening hours.

Required forms:

```text
FULL_DAY
PARTIAL_DAY
```

A special closure should be able to represent:

- date;
- full-day flag/type;
- optional start time;
- optional end time;
- internal reason;
- optional public message;
- active/publish state where applicable.

### 14.1. Precedence

```text
SpecialClosure
>
OpeningHours
```

A full-day closure returns no public availability for that date.

A partial-day closure removes candidate reservation windows that overlap the closure window.

The same overlap semantics used by reservations should be applied consistently.

---

## 15. Table assignment

### MVP proposal

```text
Availability model: CAPACITY_FIRST
Table assignment: MANUAL
Automated table assignment: DEFERRED
```

Status: **PROPOSED / NEEDS CONFIRMATION**

Admin may assign tables manually after reservation creation.

Public availability does not depend on a client-side table choice.

Automated table optimization is not part of the MVP unless a later decision explicitly promotes it.

If the business selects table-aware availability instead, the Phase 8 schema and concurrency strategy must be redesigned accordingly before migration is frozen.

---

## 16. Reservation idempotency / duplicate-submit protection

Status: **CONFIRMED AS ENGINEERING REQUIREMENT**

Reservation creation must support duplicate-submit protection.

Recommended API contract:

```text
Idempotency-Key
```

Semantics:

```text
same idempotency key
+ same normalized request
→ return/reuse the original successful result

same idempotency key
+ materially different request
→ reject as idempotency conflict
```

A browser retry, double-click, proxy retry, or network retry must not create a second reservation.

The chosen persistence/locking mechanism must make this guarantee enforceable under concurrency.

---

## 17. Confirmation

### 17.1. UI confirmation

Status: **CONFIRMED**

After successful booking, confirmation displays:

- Reservation ID/code.
- Restaurant-local date.
- Restaurant-local time.
- Guest count.
- Guest contact summary where appropriate.
- Notes/special request where appropriate.

Possible CTA:

- Add to Calendar.
- Manage Reservation only if that feature is included in the active release.

### 17.2. Email confirmation

Status: **PROPOSED**

Recommended:

- send after successful reservation commit;
- include reservation code;
- date/time in restaurant timezone;
- guest count;
- verified restaurant contact;
- cancellation/manage instructions if applicable.

### 17.3. Transaction boundary

Reservation creation must not depend transactionally on successful email delivery.

Example:

```text
reservation commit succeeds
    ↓
email send fails
    ↓
reservation remains valid
    ↓
email failure is observable/retryable
```

Email retry must not create another reservation.

---

## 18. Cancellation policy

Status: **OPEN**

### 18.1. Admin cancellation

Proposed allowed transitions:

```text
PENDING   -> CANCELLED
CONFIRMED -> CANCELLED
```

When cancellation commits, the reservation immediately stops consuming future availability.

### 18.2. Guest self-service cancellation

Proposed cutoff:

```text
24 hours before reservation
```

This value is not final business truth until confirmed.

If guest self-service cancellation is not included in the active release, Phase 8 does not need to enforce the 24-hour rule on public APIs.

### 18.3. Cancellation fees

MVP proposal:

```text
no cancellation fee
```

because deposit/payment is currently outside MVP scope.

---

## 19. Deposit / payment

Status: **PROPOSED: NOT IN MVP**

Rules:

- No deposit/payment is required for regular MVP reservation creation.
- Reservation creation does not depend on a payment gateway.
- No card guarantee is required unless a later business decision supersedes this rule.
- If no-show protection is later required, create a separate decision for deposit/card guarantee/payment behavior.

---

## 20. Dress code

Status: **OPEN**

Current placeholder concept:

```text
Smart casual / refined casual
```

The source requires dress-code information to be discoverable but does not provide final approved production wording.

Do not publish placeholder dress-code copy as production policy until business approval.

Dress code does not block the Phase 8 core reservation engine.

---

## 21. Private Dining

Capacity baseline:

```text
Private Room: 12–20 guests
Chef's Table: 6–8 guests
Full Restaurant Buyout: up to 80 guests
```

Status: **CONFIRMED FROM SOURCE**

Event enquiry fields:

- Name.
- Email.
- Phone.
- Event date.
- Guests.
- Event type.
- Budget.
- Message.

Status: **CONFIRMED**

Parties outside the regular online reservation range should be routed to Private Dining/contact rather than forced through the regular reservation engine.

---

## 22. Contact information

Current source/example values include:

```text
hello@emberandoak.com
+1 212 555 0188
```

Status: **SOURCE VALUE / PRODUCTION UNVERIFIED**

These values conflict with the current Ho Chi Minh City operational direction and must not be considered production contact truth until DEC-0022 is confirmed.

Before production release, confirm:

- public email;
- public phone;
- full address;
- directions URL;
- location display name.

Production confirmation, calendar exports, Contact page, footer, and structured data must use the same canonical verified source.

---

## 23. Input validation

Server validation is authoritative.

Client validation is a UX enhancement only.

Server must validate at minimum:

- Date is a valid restaurant-local date.
- Date is not in the past.
- Date is within the booking window.
- Requested time is a generated/valid candidate slot.
- Same-day cutoff is satisfied.
- Guest count is within allowed regular reservation range.
- Name is present and within configured length limits.
- Email format is valid.
- Phone input passes the accepted normalization/validation rule.
- Special request does not exceed the configured maximum length.
- Reservation state transition is valid.
- Reservation availability is still valid at submit time.
- Idempotency requirements are satisfied.

### 23.1. Special request length

Status: **PROPOSED / NEEDS CONFIRMATION**

Recommended MVP:

```text
maximum 1000 characters
```

Do not hard-code a different value in client and server.

### 23.2. Phone normalization

Status: **PROPOSED ENGINEERING RULE**

Recommended canonical representation:

```text
E.164-compatible normalized phone number
```

Example:

```text
+84901234567
```

The exact accepted input formats and Vietnam-specific validation strictness should be confirmed before final API validation is frozen.

---

## 24. Reservation code

Status: **ENGINEERING RULE TO FREEZE IN PHASE 8**

Every reservation must have a non-PII public reservation code distinct from the internal database ID.

Requirements:

- unique;
- difficult to guess sequentially;
- safe to show in UI/email;
- not derived directly from phone/email;
- generated server-side;
- protected by a database uniqueness constraint.

The exact format is an implementation decision unless product requires a human-readable pattern.

---

## 25. PII rules

Reservation/customer PII includes:

- Name.
- Email.
- Phone.
- Special request where it contains personal information.
- Internal notes where staff may enter personal/sensitive context.

Status: **PROPOSED SECURITY BASELINE**

Rules:

- Do not send PII to analytics.
- Do not log full PII in application/error logs.
- Redact or minimize sensitive fields in structured logs.
- Admin routes require authentication and authorization.
- Only display data required for the staff role/task.
- Reservation codes must not encode PII.
- Secrets and credentials must never be stored in reservation records.
- A retention/deletion policy must be confirmed before production release.

---

## 26. Concurrency rule

Status: **CONFIRMED AS ENGINEERING REQUIREMENT**

Scenario:

```text
User A sees a slot as available
User B sees the same slot as available
Both submit concurrently
```

Frontend availability does not prevent double booking.

Reservation creation must:

1. Start a transaction.
2. Re-read/revalidate the relevant availability state.
3. Apply a database locking/constraint strategy appropriate to the confirmed availability model.
4. Reject one request when accepting both would exceed the booking rule/capacity.
5. Preserve idempotency.
6. Leave no partial reservation/customer state on failure.

The exact SQL/locking algorithm belongs to Phase 8 implementation, but the no-double-book guarantee is mandatory.

---

## 27. Failure semantics

Status: **PROPOSED ENGINEERING BASELINE**

Reservation APIs should distinguish at least:

```text
VALIDATION_ERROR
CLOSED
SPECIAL_CLOSURE
OUTSIDE_BOOKING_WINDOW
SAME_DAY_CUTOFF
PARTY_TOO_LARGE
NO_AVAILABILITY
SLOT_CONFLICT
IDEMPOTENCY_CONFLICT
INVALID_STATE_TRANSITION
NOT_FOUND
UNAUTHORIZED
INTERNAL_ERROR
```

Error responses must be consistent and must not expose:

- SQL details;
- secrets;
- stack traces in production;
- unnecessary guest PII.

---

## 28. Open business decisions — Phase 8 hard blockers

The following decisions must be resolved before the final Phase 8 reservation domain/schema is considered frozen:

1. **MVP location model** — confirm single-location.
2. **Restaurant timezone** — confirm `Asia/Ho_Chi_Minh`.
3. **Initial regular online reservation status** — recommended `CONFIRMED`.
4. **Allowed reservation state transitions**.
5. **Capacity-consuming statuses**.
6. **Slot interval** — proposed 30 minutes.
7. **Standard dining duration** — proposed 120 minutes.
8. **Regular online guest min/max** — proposed 1–8.
9. **Advance booking window** — proposed 30 restaurant-local calendar days.
10. **Same-day cutoff** — proposed 120 minutes.
11. **Closing-time semantics** — service-end vs last-seating.
12. **Arrival grace semantics**.
13. **Turn buffer** — recommended 0 minutes for MVP.
14. **Availability model** — table-aware vs capacity-first.
15. **Production capacity source/model** if capacity-first is selected.
16. **Special closures as an MVP operational rule**.
17. **Admin/manual table-assignment boundary**.

Until these are confirmed, dependent tickets remain `BLOCKED_BY_DECISION`.

---

## 29. Open decisions that do not block the Phase 8 core engine

These remain important but do not need to block the initial reservation-domain implementation if their behavior is kept outside the core engine:

1. Currency.
2. Primary language/multi-language policy.
3. Dress code production wording.
4. Production public phone/email.
5. Guest self-service cancellation cutoff.
6. Email confirmation requirement.
7. Deposit/payment final business sign-off, provided payment remains outside the active reservation transaction.
8. Add-to-Calendar content dependent on verified location/contact data.

---

## 30. Phase 8 server-authority invariants

These rules must remain true regardless of later UI implementation:

```text
Client does not own availability.
```

```text
Availability search and reservation creation use the same domain rules.
```

```text
Reservation submit always revalidates availability server-side.
```

```text
Critical reservation mutation is transactional.
```

```text
Duplicate network submission must not create duplicate reservations.
```

```text
A reservation confirmation is shown only after successful commit.
```

```text
Invalid state transitions are rejected.
```

```text
Draft/proposed business values are configuration or decision inputs,
not silently hard-coded production truth.
```

---

## 31. Phase 8.0 freeze gate

Phase 8.0 is `READY / CLOSED` under DEC-0026 through DEC-0037:

- [x] DEC-0007 location model is confirmed or superseded.
- [x] DEC-0009 timezone is confirmed or superseded.
- [x] DEC-0010 slot interval is confirmed.
- [x] DEC-0011 dining duration is confirmed.
- [x] DEC-0012 guest range is confirmed.
- [x] DEC-0013 booking window is confirmed.
- [x] DEC-0014 same-day cutoff is confirmed.
- [x] DEC-0019 availability model is confirmed.
- [x] Initial online reservation status is confirmed.
- [x] Capacity-consuming statuses are confirmed.
- [x] Closing-time semantics are confirmed.
- [x] Turn-buffer semantics are confirmed.
- [x] Special-closure behavior is confirmed.
- [x] Production capacity is explicitly data-driven and not invented.
- [x] Decision log matches this business-rule baseline.
- [x] No `OPEN` value required by the Phase 8 domain model is being hard-coded as business truth.

After this gate passes, Phase 8.1 may begin:

```text
Reservation contracts
↓
validation contracts
↓
domain model
↓
database schema/migration
↓
state machine
↓
opening hours / special closures
↓
availability engine
↓
reservation creation
↓
concurrency + idempotency
↓
public/admin APIs
↓
unit + integration tests
```
