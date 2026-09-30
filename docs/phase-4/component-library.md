# EMBER & OAK — COMPONENT LIBRARY SPECIFICATION

Status: **DESIGN SYSTEM CONTRACT**

This is a visual/behavior specification, not application code.

# 1. Header

## Variants

- `hero-transparent`
- `sticky-dark`
- `mobile-compact`
- `mobile-menu-open`

## States

- default.
- scrolled.
- current-route.
- focus-visible.
- mobile open/closed.

## Rules

- Reserve CTA visually primary.
- Header height stable between transparent/scrolled state.
- Navigation does not jump when background appears.

---

# 2. Brand mark

Primary:
```text
EMBER & OAK
```

Treatment:
- restrained.
- high contrast.
- no oversized decorative icon required.

---

# 3. Primary CTA

Example:
```text
RESERVE A TABLE
```

Baseline visual:

```text
background: accent #C66A3A
text: #171512
border: accent
```

States:

### Default
- dark text on accent.

### Hover
- transition toward copper/darker accent or background-slide treatment.

### Focus visible
- clear 2px+ focus treatment separated from button border.

### Active
- subtle pressed state.

### Disabled
- reduced contrast but still readable.
- not interactive.

### Loading
- preserves width.
- label remains understandable.

---

# 4. Secondary CTA

Example:
```text
VIEW MENU
```

Baseline:
- transparent.
- light text on dark background.
- subtle border or editorial underline.

Hover:
- accent underline/fill shift.

---

# 5. Text link

Variants:
- inline.
- navigation.
- directional CTA.

Optional arrow:
`→`

Arrow motion may move slightly on hover/focus.

---

# 6. Section label

```text
OUR PHILOSOPHY
SIGNATURE MENU
EXECUTIVE CHEF
```

Style:
- label token.
- uppercase.
- wide tracking.
- muted beige/accent.

---

# 7. Menu row

Content:

```text
index
dish name
description
price
availability marker if required
```

States:
- default.
- hover.
- focus.
- unavailable.
- selected/featured only where needed.

Desktop hover/focus:
- index → accent.
- small text translation.
- associated image transition.

Mobile:
- static readable list.
- no hover dependency.

---

# 8. Form field

Types:
- text.
- email.
- tel.
- textarea.
- date-compatible control.

Visual:
- dark or cream surface depending page context.
- simple border/underline.
- no decorative floating labels unless accessibility remains robust.

States:

```text
default
hover
focus
filled
disabled
error
success optional
```

Error:
- semantic error color.
- message beneath input.
- icon optional.
- not color-only.

---

# 9. Select / guest selector

States:
- closed.
- focus.
- open.
- option focus.
- selected.
- disabled.
- error.

If native select is used, styling may be limited intentionally.

---

# 10. Date input

Phase 4 visual requirements:
- clear date affordance.
- readable selected value.
- visible disabled dates if custom calendar is later used.

Phase 5 should prefer robust accessible behavior over a heavily styled custom calendar without need.

---

# 11. Time slot

Baseline:
- compact selectable control.
- dark surface with subtle border.

States:

### Available
- light text + subtle border.

### Hover/focus
- accent border/label.

### Selected
- accent background.
- dark text.

### Disabled
- clear unavailable state.

### Stale/conflict
- removed or marked unavailable after refresh; do not keep selected styling.

---

# 12. Reservation summary

Displays:
- Date.
- Time.
- Guests.

Design:
- compact editorial summary.
- readable at top of Guest Details.
- `Change` action is secondary.

---

# 13. Error summary

Use on multi-field reservation forms where useful.

Content:
- concise heading.
- list of actionable errors.
- links/focus behavior to fields where implementation supports.

---

# 14. Notification / toast

Use for transient operational feedback only.

Do not use toast as the only place for:
- reservation confirmation.
- critical form validation.
- destructive failure.

Variants:
- success.
- info.
- warning.
- error.

---

# 15. Modal/dialog

Use sparingly.

Possible:
- gallery lightbox.
- confirmation for destructive admin action.

Required states:
- focus trap.
- Escape close where appropriate.
- explicit close.
- return focus.

---

# 16. Image frame

Variants:
- portrait.
- landscape.
- full bleed.
- editorial overlap.
- gallery masonry.

Rules:
- maintain known aspect ratio.
- respect focal point.
- stable dimensions before load.

---

# 17. Footer

Editorial footer with:
- large brand statement.
- grouped navigation.
- operational information.
- legal.

No card boxes.

---

# 18. Mobile navigation drawer

Surface:
- dark.
- full or near-full viewport.

Items:
- generous vertical spacing.
- large touch targets.
- Reserve CTA separated as primary.

---

# 19. Gallery category filter

Visual:
- text tabs / understated segmented navigation.

Avoid:
- pill-chip cloud that feels SaaS.

States:
- default.
- hover.
- focus.
- current.

---

# 20. Private Dining experience block

Not a generic card.

Composition:
- large image.
- name.
- capacity.
- body.
- optional CTA.

Alternating desktop layout, stacked mobile.

---

# 21. Admin components

Public design components are not blindly reused for admin.

Admin needs:
- app header/sidebar.
- table/list.
- filter bar.
- status badge.
- pagination.
- form.
- dialog.
- empty state.
- data detail panel.

Admin visual language should be restrained and functional.

---

# 22. Component state checklist

Every interactive component must consider where applicable:

```text
default
hover
focus-visible
active
selected
disabled
loading
error
success
empty
```
