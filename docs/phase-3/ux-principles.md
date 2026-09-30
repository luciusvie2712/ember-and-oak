# EMBER & OAK — UX PRINCIPLES

Status: **BASELINE UX CONTRACT**

## 1. Primary user intent

The experience must convert:

```text
interest
→ confidence
→ intent
→ reservation
```

The website should make the guest think:

> “I want to experience this restaurant.”

not merely:

> “I want to inspect the menu.”

## 2. Primary UX hierarchy

```text
1. Brand experience
2. Food discovery
3. Story / credibility
4. Atmosphere / occasion fit
5. Reservation conversion
6. Operational information
```

Reservation is the primary conversion, but the interface should not behave like a booking utility before the user has a reason to care.

## 3. Reserve CTA rule

`Reserve a Table` must remain reachable from:

- Header.
- Home Hero.
- Home reservation section.
- Menu.
- Private Dining where contextually appropriate.
- Footer.
- Mobile sticky CTA.

The CTA should not compete with itself by appearing as multiple primary buttons in the same viewport without purpose.

## 4. Editorial-first layout

Do:

- Use strong content hierarchy.
- Use large media.
- Use asymmetric composition.
- Use whitespace intentionally.
- Let content breathe.

Do not:

- Convert every section into cards.
- Use dashboard-like dense grids.
- Add icon-heavy feature lists.
- Introduce SaaS navigation patterns.
- Use visual decoration that competes with food/photography.

## 5. Progressive disclosure

Only ask for information when required.

Reservation example:

```text
Search
→ choose available time
→ enter guest information
→ confirm
```

Do not request full personal information before showing that a slot exists.

## 6. Error prevention before error messaging

Prefer:

- Disable impossible dates.
- Prevent past date selection.
- Constrain guest range.
- Only show available slot choices.
- Disable repeat submit while request is in flight.

Then provide explicit recovery when server truth changes.

## 7. Trust

Reservation surfaces should make the guest confident that:

- Date/time are clear.
- Guest count is clear.
- Restaurant timezone is clear once confirmed.
- Contact information is available.
- Booking confirmation is unambiguous.
- A failed request does not appear successful.

## 8. Mobile-first interaction, not mobile-first visual reduction

Mobile should:

- Keep Reserve CTA reachable.
- Use vertical reservation inputs.
- Avoid hover-only interaction.
- Avoid image compositions that require desktop viewport width.
- Protect content from sticky CTA overlap.
- Keep touch targets sufficiently large.

## 9. Accessibility is part of UX architecture

Every interactive design must define:

- Keyboard order.
- Visible focus.
- Programmatic label.
- Error association.
- Loading announcement where useful.
- Reduced-motion behavior.
- Touch target behavior.

## 10. Canonical data UX

Do not duplicate operational facts in page-specific rich text.

Examples:

```text
Opening hours
Address
Phone
Email
Dish price
Dish availability
Chef profile
```

UI should display canonical sources defined in Phase 2.

## 11. No dead-end principle

Every major page should end with a meaningful next step:

- Menu → Reserve.
- Story → Reserve / Menu.
- Gallery → Reserve.
- Private Dining → Enquiry / Reserve.
- Contact → Directions / Reserve.
- Reservation failure → Retry / choose another slot.

## 12. Content before controls

Public pages should not over-prioritize controls above narrative content.

Exception:
- Reservation page.
- Operational Contact section.

## 13. Loading state rule

Loading state must preserve layout where possible.

Avoid:

- Full-page spinners for small data refresh.
- Hiding user input while fetching slots.
- Shifting the entire page when results appear.

## 14. Confirmation rule

A reservation is visually confirmed only after successful server commit.

Do not show success based on optimistic client state.

## 15. UI state ownership

Frontend owns presentation state.

Server/domain owns truth for:

- Availability.
- Reservation validity.
- Reservation state.
- Special closure impact.
- Concurrency conflict.

## 16. Phase 3 non-goals

- Pixel-perfect design.
- Final micro-animation timings.
- Brand asset production.
- Component library implementation.
