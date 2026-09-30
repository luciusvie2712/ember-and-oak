# EMBER & OAK — RESPONSIVE UX BEHAVIOR

Status: **PHASE 3 RESPONSIVE CONTRACT**

Phase 3 does not define exact breakpoints. Phase 4/5 may select breakpoints based on content.

## 1. Principle

Responsive behavior is defined by content priority, not device labels alone.

## 2. Header

### Wide
- Logo.
- Inline nav.
- Reserve CTA.

### Narrow
- Logo.
- Menu trigger.
- Sticky Reserve CTA.
- Drawer/overlay navigation.

## 3. Home Hero

### Wide

```text
copy                    portrait image
CTA row                 optional overlap image
```

### Narrow

```text
title
description
CTA
image
```

Do not force side-by-side layout at widths where typography becomes cramped.

## 4. Philosophy

Wide:
- text/media split.

Narrow:
- heading/body.
- media below or between content according to narrative.

## 5. Signature Menu

Wide:
- list + dynamic image.

Narrow:
- list becomes primary.
- dynamic desktop hover image may become static featured image or inline media.
- no hover dependency.

## 6. Atmosphere

Wide:
- immersive full-width media.

Narrow:
- stable image/poster.
- avoid autoplay-heavy video.

## 7. Chef Story

Wide:
- image/story split.

Narrow:
- image.
- story.
- quote.

## 8. Dining Experiences

Wide:
- alternating editorial compositions.

Narrow:
- stacked large media/content blocks.

Avoid:
- shrinking to three tiny cards.

## 9. Menu

Wide:
- category nav can stay sticky if useful.
- dish line preserves price alignment.

Narrow:

```text
dish name        price
description
```

Long names wrap without colliding with price.

## 10. Gallery

Wide:
- asymmetric/masonry.

Narrow:
- fewer columns or single-column varied-ratio stream.
- no horizontal scrolling for basic content.

## 11. Private Dining

Wide:
- alternating image/content.

Narrow:
- media → heading → capacity → description.
- form single column.

## 12. Reservation

### Wide

Search may be horizontal:

```text
DATE | GUESTS | FIND
```

Availability slots can wrap in row/grid.

Guest details can use controlled two-column grouping if labels remain clear.

### Narrow

Always vertical:

```text
DATE
GUESTS
FIND

slots wrap

NAME
EMAIL
PHONE
SPECIAL REQUEST
SUBMIT
```

## 13. Sticky CTA collision rules

Mobile sticky CTA must not cover:
- Submit button.
- Cookie/privacy controls if added.
- Footer links.
- Native browser safe area.
- Validation messages.

Possible approaches later:
- add bottom page padding,
- hide sticky CTA on reservation route,
- contextually replace with current-step action.

Default Phase 3 recommendation:
**hide global sticky Reserve CTA inside the reservation flow.**

## 14. Typography wrapping

Phase 4 must test:

- Hero heading at narrow width.
- Long dish names.
- Private Dining capacity labels.
- Vietnamese diacritics if Vietnamese is primary.
- English strings if localization remains in scope.

## 15. Input modality

Touch:
- no hover dependency.

Keyboard:
- all interactive controls reachable.

Pointer:
- hover can enrich but cannot be required.

## 16. Responsive QA view categories

Exact pixels later; content should be validated against:

```text
small mobile
large mobile
tablet / compact
laptop
desktop
large desktop
```
