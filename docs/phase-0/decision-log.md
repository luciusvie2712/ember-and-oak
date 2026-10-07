# EMBER & OAK — PHASE 0 DECISION LOG

Status: **ACTIVE**

Decision IDs are append-only. A changed decision is superseded by a newer ID rather than rewritten.

| ID | Decision | Current value | Status | Rationale / Source |
|---|---|---|---|---|
| DEC-0001 | Product direction | Modern Fine Dining + Editorial | CONFIRMED | Project overview |
| DEC-0002 | Primary conversion | Reserve a Table | CONFIRMED | Project overview |
| DEC-0003 | Release 1 routes | Home, Menu, Our Story, Private Dining, Gallery, Reservations, Contact | CONFIRMED | Project overview |
| DEC-0004 | Reservation statuses | PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW | CONFIRMED | Project overview |
| DEC-0005 | Mobile strategy | Mobile-specific layout; not desktop scaling | CONFIRMED | Project overview |
| DEC-0006 | Layout strategy | Editorial/asymmetric; avoid SaaS/card-heavy UI | CONFIRMED | Project overview |
| DEC-0007 | MVP location model | Single location | SUPERSEDED by DEC-0026 | Phase 8 freeze |
| DEC-0008 | Currency | VND | PROPOSED | Current operating direction |
| DEC-0009 | Timezone | Earlier inferred timezone | SUPERSEDED by DEC-0027 | Phase 8 freeze |
| DEC-0010 | Slot interval | 30 minutes | SUPERSEDED by DEC-0029 | Phase 8 freeze |
| DEC-0011 | Standard reservation duration | 120 minutes | SUPERSEDED by DEC-0029 | Phase 8 freeze |
| DEC-0012 | Regular guest range | 1–8 | SUPERSEDED by DEC-0030 | Phase 8 freeze |
| DEC-0013 | Advance booking window | 30 days | SUPERSEDED by DEC-0031 | Phase 8 freeze |
| DEC-0014 | Same-day cutoff | 2 hours before slot | SUPERSEDED by DEC-0031 | Phase 8 freeze |
| DEC-0015 | Guest self-service cancellation cutoff | 24 hours | OPEN | Not part of Phase 8 public API |
| DEC-0016 | Deposit/payment | Not in MVP | CONFIRMED | Phase 8 scope |
| DEC-0017 | Email confirmation | Deferred from booking transaction | PROPOSED | Delivery must be post-commit |
| DEC-0018 | Table assignment | Manual admin assignment in MVP | SUPERSEDED by DEC-0032 | Phase 8 freeze |
| DEC-0019 | Availability model | Earlier options | SUPERSEDED by DEC-0032 | Phase 8 freeze |
| DEC-0020 | Dress code | Smart casual placeholder only | OPEN | Does not block booking engine |
| DEC-0021 | Special closure | MVP operational requirement | SUPERSEDED by DEC-0033 | Phase 8 freeze |
| DEC-0022 | Production contact/address | Verify current source values | OPEN | Does not block booking engine |
| DEC-0023 | Primary language | Vietnamese | PROPOSED | Current operating direction |
| DEC-0024 | Multi-language | Deferred post-MVP | CONFIRMED | MVP scope |
| DEC-0025 | Phase 7 content implementation | First-party PostgreSQL + Nest content service and minimal Admin editor | CONFIRMED | Phase 7 architecture |
| DEC-0026 | MVP location model | Single location | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0027 | Restaurant timezone | `Asia/Ho_Chi_Minh`; business dates/times are restaurant-local, technical timestamps are UTC | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0028 | Reservation lifecycle | Online create is `CONFIRMED`; allowed transitions are PENDING→CONFIRMED/CANCELLED, CONFIRMED→SEATED/CANCELLED/NO_SHOW, SEATED→COMPLETED; PENDING/CONFIRMED/SEATED consume capacity | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0029 | Slot semantics | 30-minute interval, 120-minute duration, zero turn buffer, close time means service end, half-open overlap `[start,end)` | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0030 | Regular online guest range | Inclusive 1–8; larger parties route to Private Dining/contact | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0031 | Booking horizon | Restaurant-local today through today + 30 calendar days inclusive; same-day slot requires at least 120 minutes lead time | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0032 | Availability/capacity model | `CAPACITY_FIRST`; operational capacity is data-driven; manual table assignment is outside availability | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0033 | Special closures | Active full-day closure blocks the date; active partial closure removes overlapping slots | CONFIRMED | Phase 8.0 freeze, 2026-10-05 |
| DEC-0034 | Reservation concurrency | Transactional revalidation under a PostgreSQL advisory transaction lock keyed by service date | CONFIRMED | Prevent overlapping-slot races |
| DEC-0035 | Reservation idempotency | Required request key, normalized request hash, 24-hour bounded record; same key/body replays and changed body conflicts | CONFIRMED | Duplicate-submit protection |
| DEC-0036 | Public reservation code | Server-generated non-PII `EO-` code with a database uniqueness constraint and collision retry | CONFIRMED | Safe public confirmation identifier |
| DEC-0037 | Public input limits | E.164-compatible phone, normalized email/name, special request up to 1000 characters | CONFIRMED | Phase 8 server validation |
| DEC-0038 | Production contact publication | Address, email, phone, and directions URL require business confirmation before publication | OPEN | Phase 10 contact and operational-content gate; extends DEC-0022 |
| DEC-0039 | Private-event enquiry delivery | PostgreSQL commit is authoritative; notification is optional downstream delivery; provider and recipient remain undecided | CONFIRMED | Phase 10 transactional workflow; no enquiry lost on notification failure |
| DEC-0040 | Event type and budget input | Bounded free text until business event taxonomy and currency are confirmed | CONFIRMED | Avoid invented enums or monetary normalization in Phase 10 |
| DEC-0041 | MVP menu currency | VND | CONFIRMED | Supersedes DEC-0008 for Phase 11 menu administration |
| DEC-0042 | Admin roles | ADMIN, HOST, CONTENT_EDITOR; API-enforced capability matrix | CONFIRMED | Minimal distinct operational roles for Phase 11 |
| DEC-0043 | Admin reservation cancellation | PENDING/CONFIRMED may transition to CANCELLED; reason required (max 500); set cancelled_at; append immutable status event | CONFIRMED | Auditable cancellation and immediate capacity release |

## Phase 8 freeze effect

DEC-0026 through DEC-0037 are authoritative for the Phase 8 reservation backend. Production cover capacity remains operational data and is deliberately not invented by a migration or application constant. Test/staging capacity may use an explicitly labelled fixture.

Open cancellation, dress-code, contact, email-delivery, currency, and language decisions do not alter the Phase 8 core availability or creation transaction.

## Decision template

```markdown
## DEC-XXXX — <Title>

Date:
Owner:
Status: PROPOSED | CONFIRMED | REJECTED | SUPERSEDED

### Context

### Decision

### Alternatives considered

### Consequences

### Follow-up
```

## Rules

- Resolve a blocking `OPEN` decision before freezing its dependent schema/domain behavior.
- Do not hard-code an open value as production truth.
- Keep operational values such as service capacity in data, not domain algorithms.
