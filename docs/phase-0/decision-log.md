# EMBER & OAK — PHASE 0 DECISION LOG

Status: **ACTIVE**

Decision IDs dùng xuyên suốt project. Không sửa lịch sử quyết định; nếu thay đổi, tạo decision mới supersede decision cũ.

| ID | Decision | Current value | Status | Rationale / Source |
|---|---|---|---|---|
| DEC-0001 | Product direction | Modern Fine Dining + Editorial | CONFIRMED | Project overview |
| DEC-0002 | Primary conversion | Reserve a Table | CONFIRMED | Project overview |
| DEC-0003 | Release 1 routes | Home, Menu, Our Story, Private Dining, Gallery, Reservations, Contact | CONFIRMED | Project overview |
| DEC-0004 | Reservation statuses | PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW | CONFIRMED | Project overview |
| DEC-0005 | Mobile strategy | Mobile-specific layout; not desktop scaling | CONFIRMED | Project overview |
| DEC-0006 | Layout strategy | Editorial/asymmetric; avoid SaaS/card-heavy UI | CONFIRMED | Project overview |
| DEC-0007 | MVP location model | Single location | PROPOSED | Source shows one location |
| DEC-0008 | Currency | USD | OPEN / PROPOSED | `$` prices in source |
| DEC-0009 | Timezone | America/New_York | OPEN / PROPOSED | +1 212 / Mercer Street inference |
| DEC-0010 | Slot interval | 30 minutes | PROPOSED | Reservation example uses 30-minute intervals |
| DEC-0011 | Standard reservation duration | 120 minutes | OPEN |
| DEC-0012 | Regular guest range | 1–8 | OPEN / PROPOSED | Private dining starts around larger groups |
| DEC-0013 | Advance booking window | 30 days | OPEN |
| DEC-0014 | Same-day cutoff | 2 hours before slot | OPEN |
| DEC-0015 | Cancellation cutoff | 24 hours | OPEN |
| DEC-0016 | Deposit/payment | Not in MVP | PROPOSED |
| DEC-0017 | Email confirmation | Include in MVP | PROPOSED |
| DEC-0018 | Table assignment | Manual admin assignment in MVP | PROPOSED |
| DEC-0019 | Availability model | Table-aware OR capacity-first | OPEN |
| DEC-0020 | Dress code | Smart casual placeholder only | OPEN |
| DEC-0021 | Special closure | Promote to MVP operational requirement | PROPOSED |
| DEC-0022 | Production contact/address | Verify current source values | OPEN |
| DEC-0023 | Primary language | English | PROPOSED |
| DEC-0024 | Multi-language | Deferred post-MVP | PROPOSED |
| DEC-0025 | Phase 7 content implementation | First-party headless content service: PostgreSQL + Nest API + minimal Admin editor; S3-compatible media + CDN | CONFIRMED | Phase 7 architecture preflight; see `docs/phase-7/content-architecture-decision.md` |

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

- `OPEN` decisions thuộc Phase 0 phải được xử lý trước khi schema/domain implementation bị khóa.
- Không hard-code một giá trị `OPEN` như business truth.
- Một proposed default có thể dùng trong prototype, nhưng phải nằm trong config và có chú thích.
