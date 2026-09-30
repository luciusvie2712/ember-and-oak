# EMBER & OAK — LOW-FIDELITY PROTOTYPE SPEC

Status: **PROTOTYPE HANDOFF**

## 1. Purpose

The Phase 3 prototype validates:
- information flow,
- content hierarchy,
- reservation friction,
- mobile behavior,
- error recovery.

It does not validate final branding/polish.

## 2. Required prototype screens

### Global / Public

1. Home — desktop.
2. Home — mobile.
3. Menu — desktop.
4. Menu — mobile.
5. Our Story.
6. Private Dining.
7. Gallery.
8. Contact.

### Reservation

9. Reservation Search.
10. Searching/loading.
11. Available Times.
12. No Availability.
13. Restaurant Closed.
14. Unsupported Guest Count.
15. Guest Details.
16. Guest Validation Error.
17. Submitting.
18. Slot Conflict.
19. Generic Submission Error.
20. Confirmation.

### Navigation

21. Mobile navigation open.
22. Sticky mobile Reserve behavior.

## 3. Prototype connections

```text
Home Hero / Header CTA
→ Reservation Search

Home View Menu
→ Menu

Menu Reserve
→ Reservation Search

Home Story
→ Our Story

Home Private Dining
→ Private Dining

Private Dining Plan Event
→ Enquiry form

Contact Reserve
→ Reservation Search
```

## 4. Reservation prototype path — happy path

```text
Search
→ Available Times
→ Select 19:00
→ Guest Details
→ Submitting
→ Confirmation
```

## 5. Reservation prototype path — no availability

```text
Search
→ No Availability
→ Change Date
→ Available Times
```

## 6. Reservation prototype path — stale slot

```text
Guest Details
→ Submit
→ Slot Conflict
→ Select Alternate Slot
→ Resubmit
→ Confirmation
```

## 7. Mobile prototype requirements

Must demonstrate:
- mobile nav open/close,
- sticky reserve CTA,
- hero stacking,
- menu stacking,
- reservation vertical layout,
- CTA not covering submit/form.

## 8. Prototype content

Use realistic fixture content from existing project source where available.

Do not invent:
- awards,
- final policies,
- final production contact details,
- final business rules marked OPEN.

## 9. Prototype fidelity

Allowed:
- grayscale,
- basic boxes,
- simple type hierarchy,
- placeholder images labeled by asset purpose.

Avoid:
- choosing final fonts,
- final color polish,
- detailed animation,
- production icon set.

## 10. UX test tasks

Recommended internal validation tasks:

### Task A
“Find a signature dish and reserve a table.”

Success:
- user reaches confirmation without confusion.

### Task B
“You want a private dinner for a group larger than a regular table booking.”

Success:
- user reaches Private Dining enquiry rather than forcing regular reservation.

### Task C
“Check whether the restaurant is open on Sunday and get directions.”

Success:
- user finds hours/location quickly.

### Task D
“Your selected time becomes unavailable before submit.”

Success:
- user understands conflict and chooses another slot without retyping personal details.

## 11. Questions prototype should answer

- Is Reserve CTA easy to find?
- Does Home feel story-first rather than form-first?
- Does Menu scan well?
- Does mobile remain usable without hover?
- Does reservation ask for information in the right order?
- Are error states recoverable?
- Does Private Dining stay distinct from standard booking?

## 12. Handoff to Phase 4

Phase 4 receives:
- screen hierarchy,
- wireframes,
- state matrix,
- responsive behavior,
- interaction semantics,
- accessibility requirements.

Phase 4 adds:
- visual tokens,
- typography,
- color,
- imagery composition,
- component styling,
- final motion timing/easing.
