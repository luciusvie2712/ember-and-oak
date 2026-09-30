# EMBER & OAK — RESERVATION UI STATES & ERROR MATRIX

Status: **UX STATE CONTRACT**

## 1. State model

```text
IDLE
SEARCHING
AVAILABLE
NO_AVAILABILITY
CLOSED
INVALID_SEARCH
SLOT_SELECTED
DETAILS_EDITING
SUBMITTING
CONFLICT
SUBMIT_ERROR
CONFIRMED
```

This is a UI state model, not the backend reservation status model.

---

# 2. Search states

| State | Trigger | User feedback | Recovery |
|---|---|---|---|
| IDLE | Initial | Form ready | Enter date/guests |
| INVALID_SEARCH | Invalid client/server input | Field-level + summary error | Correct input |
| SEARCHING | Availability request pending | Keep form visible, show progress | Wait/cancel only if supported |
| AVAILABLE | Slots returned | Show slots | Select one |
| NO_AVAILABILITY | Open but no valid slots | Explicit fully booked message | Change date |
| CLOSED | Restaurant closed | Closed message | Change date |
| UNSUPPORTED_GUESTS | Count outside regular range | Explain regular booking limitation | Private Dining/contact |

---

# 3. Slot states

| State | Behavior |
|---|---|
| AVAILABLE | Interactive |
| HOVER | Optional pointer enhancement |
| FOCUS | Visible keyboard state |
| SELECTED | Clear persistent selected state |
| DISABLED | Not selectable; reason should be understandable where relevant |
| STALE | Removed after server refresh/conflict |

Do not use color alone to communicate selected/disabled.

---

# 4. Guest form states

## Default

Fields empty or restored.

## Field validation

Examples:
- Required name.
- Invalid email.
- Invalid phone format/length based on final validation.
- Special request max length if defined.

UX:
- Error near field.
- Programmatically associated.
- Summary optional when multiple errors.

## Submitting

- Submit disabled.
- Inputs may stay visible.
- Avoid destructive spinner-only page.

---

# 5. Submission outcomes

## Confirmed

Only after successful server commit.

## Slot conflict

HTTP/API details belong later, but UX semantics:

```text
Selected time is no longer available.
```

Recovery:
- preserve guest data,
- refresh slots,
- return to slot selection.

## Validation rejected by server

Map response to relevant fields/general summary.

## Generic internal failure

Message:
- concise,
- no stack/error ID details exposed unless support-safe reference exists,
- retry option when safe.

## Ambiguous timeout

Show verification uncertainty, not false success/failure certainty.

---

# 6. Reservation backend status vs UI

Backend status:

```text
PENDING
CONFIRMED
SEATED
COMPLETED
CANCELLED
NO_SHOW
```

Public confirmation screen does not need to expose operational states beyond what is useful to guest.

Do not expose:
- SEATED.
- COMPLETED.
- NO_SHOW.

unless future manage-reservation feature explicitly needs them.

---

# 7. Special closure

If date is closed:

```text
Restaurant is closed on selected date.
```

Do not label as:
- “fully booked”.

Reason:
Closed and full are different operational meanings.

---

# 8. Date edge cases

UX must account for:

- Past date.
- Outside booking window.
- Same-day cutoff.
- Closed day.
- Special closure.
- Timezone boundary.

Exact rules depend on Phase 0 decisions.

---

# 9. Guest count edge cases

- Below minimum.
- Above regular maximum.
- Private dining range.
- Unsupported nonsensical values.

Do not hard-code final threshold before business confirmation.

---

# 10. Duplicate submit

Expected UX:

```text
first submit
→ button enters SUBMITTING
→ second user click ignored/disabled
```

Backend idempotency remains required even if UI disables the button.

---

# 11. Refresh / browser navigation

## Search
Safe to refresh.

## Guest form
May restore locally only if privacy/security approach permits later.

## Confirmation
Refresh must not repeat POST.

Use redirect/read pattern or equivalent implementation later.

---

# 12. State-copy tone

Copy should be:
- calm,
- precise,
- hospitality-oriented,
- not technical.

Avoid:
- “HTTP 409”.
- “Validation exception”.
- “Database conflict”.
- “Something went wrong!!!”
