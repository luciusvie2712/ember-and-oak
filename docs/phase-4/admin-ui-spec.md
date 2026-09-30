# EMBER & OAK — ADMIN UI VISUAL SPEC

Status: **PHASE 4 ADMIN DESIGN BASELINE**

Phase 4 roadmap requires high-fidelity references for:
- Admin reservation list.
- Admin reservation detail.
- Admin menu editor.

Admin is an operational application and intentionally differs from the public editorial site.

## 1. Admin visual principles

- Functional.
- Dense but readable.
- Predictable.
- Keyboard-friendly.
- Low decoration.
- Strong status clarity.

Use brand colors sparingly.

## 2. Admin palette

Recommended:
- neutral/charcoal shell.
- cream/light content surfaces.
- brand accent for active navigation/actions.
- semantic colors for statuses.

Do not make every admin surface fully dark if it harms long operational use.

## 3. Admin typography

Use Inter/system sans throughout.

Typical hierarchy:
- page title 28–32px.
- section heading 20–24px.
- table/body 14–16px.
- metadata 12–14px.

## 4. Reservation list

Desktop structure:

```text
APP HEADER / NAV

Reservations

[ Date ] [ Status ] [ Search ] [ filters ]

Time | Guest | Guests | Status | Contact | Table | Action
----------------------------------------------------------
...
```

Visual requirements:
- compact rows.
- status badges.
- clear selected/hover row.
- sticky filters/header optional.
- empty state.
- loading skeleton or stable placeholder.
- pagination/virtualization decision later.

## 5. Reservation status badges

Conceptual mapping:

```text
PENDING      neutral/warning
CONFIRMED    positive/info
SEATED       active
COMPLETED    muted success
CANCELLED    error/neutral
NO_SHOW      warning/error
```

Do not rely on color alone; status text always visible.

## 6. Reservation detail

Layout:

```text
Guest / Reservation summary
Status + valid actions

Date / Time / Guests
Contact
Special request
Internal note
Table assignment
Timeline / audit information if available
```

Actions:
- only valid transitions.
- destructive Cancel separated visually.
- confirmation dialog if appropriate.

## 7. Menu editor

Two-level operation:

```text
Menu categories
→ Dishes
```

Dish editor:
- name.
- description.
- price.
- media.
- availability.
- seasonal state.
- display order.
- publish state.

Visual:
- content form.
- optional preview.
- image thumbnail.
- save/publish actions clearly differentiated.

## 8. Content editor

Editorial CMS screens can use preview thumbnails but should not replicate public high-fidelity layout in every field editor.

## 9. Forms

Admin form fields:
- clear labels.
- helper text.
- error messages.
- save-state feedback.
- unsaved-changes handling later if implementation supports.

## 10. Mobile admin

Not primary design target.

Minimum:
- reservation lookup/list usable.
- detail readable.
- critical status actions accessible.

Complex menu/content editing may target tablet/desktop first if product agrees.

## 11. Accessibility

- keyboard access.
- visible focus.
- status text.
- table headers.
- form labels.
- dialogs correctly managed.

## 12. Separation from public visual system

Reuse:
- color tokens where appropriate.
- spacing foundation.
- typography family.
- focus system.
- form primitives where appropriate.

Do not reuse:
- oversized display typography.
- full-bleed art direction.
- editorial page layouts.
- decorative image transitions.
