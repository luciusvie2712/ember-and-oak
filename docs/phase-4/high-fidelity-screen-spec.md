# EMBER & OAK — HIGH-FIDELITY SCREEN SPECIFICATION

Status: **DESIGN HANDOFF SPEC**

This file defines the intended visual composition for screens required by Phase 4.

# 1. Home — Desktop

## Header
- Transparent on initial hero.
- Cream text.
- Accent/dark primary CTA.
- Sticky dark transition after scroll.

## Hero
- Charcoal background.
- 90–100vh.
- Left: display-xl serif.
- Right: portrait signature dish.
- Optional overlapping detail image.
- CTA row uses primary + secondary hierarchy.

## Philosophy
- Large negative space.
- Heading in heading-1 / display-lg range.
- Supporting media offset.

## Signature Menu
- Dark surface.
- Large editorial rows.
- Selected/hover row activates dish image.
- Orange used on index/active details only.

## Atmosphere
- full bleed.
- large overlay heading.
- contrast-safe overlay.

## Chef
- portrait-led asymmetric split.
- quote in serif.
- body in sans.

## Experiences
- alternating media/copy.
- not cards.

## Reservation CTA
- controlled centered moment.
- can use cream section for rhythm change.

## Location
- cream or dark contrast section.
- operational clarity.
- strong directions CTA.

# 2. Home — Mobile

- Compact header.
- Hero title 64px target.
- CTAs stack or wrap intentionally.
- Hero image after actions.
- editorial vertical sequence.
- sticky Reserve CTA except inside reservation flow.
- no overlapping hero image if it threatens readability.

# 3. Menu — Desktop

Visual:
- cream background section is acceptable for long reading.
- dark text.
- section/page title serif.
- category labels small sans.
- dishes separated with hairlines.
- price aligned right.
- accent only on hover/focus/index.

Optional sticky category navigation should stay understated.

# 4. Menu — Mobile

- category jump/filter compact.
- dish name + price.
- description below.
- no image hover requirement.
- reservation CTA after logical category/section or persistent global CTA.

# 5. Our Story

- editorial chapter structure.
- alternate dark/cream sections sparingly.
- large pull quote.
- image offsets.
- no timeline-card UI.

# 6. Private Dining

- hero media + strong statement.
- each experience is a full editorial chapter.
- capacity rendered as small accent label.
- form becomes visually calmer/functional near end.

# 7. Gallery

- dark background preferred.
- asymmetric masonry.
- category navigation is text-based.
- captions subtle.
- lightbox, if used, dark immersive with minimal chrome.

# 8. Contact

- straightforward.
- can use cream background for readability.
- large serif title.
- two-column location/hours.
- policy section understated.
- operational facts more important than decorative media.

# 9. Reservation Search

Recommended shell:

```text
dark background
narrow/medium centered content
large serif heading
clear sans-serif controls
```

Search controls:
- strong border/focus.
- Primary Find a Table button.

Avoid excessive photography immediately around form if it reduces clarity.

# 10. Reservation Availability

- search summary visible.
- time slots clearly selectable.
- selected slot accent background + dark text.
- no-availability/closed state uses copy + recovery CTA, not empty blank state.

# 11. Guest Details

- reservation summary at top.
- form hierarchy calm and readable.
- special request full-width.
- submit CTA visually dominant.
- privacy/supporting copy secondary.

# 12. Confirmation

- strong success heading.
- reservation code prominent but not larger than title.
- detail block with consistent label/value grid.
- Add to Calendar secondary/primary depending flow.
- restaurant contact assistance at bottom.

No celebratory confetti.

# 13. Mobile Reservation

- single-column.
- controls 48–56px.
- full-width actions.
- time slots 2–3 columns based on viewport.
- global sticky CTA hidden while active booking flow is displayed.

# 14. Empty/error visuals

Use:
- text hierarchy.
- small semantic icon if helpful.
- clear recovery action.

Avoid:
- giant illustrations.
- generic sad-face empty-state art.

# 15. High-fidelity screen inventory

Required design frames:

```text
HOME
01 Home / Desktop
02 Home / Mobile

MENU
03 Menu / Desktop
04 Menu / Mobile

STORY
05 Our Story / Desktop
06 Our Story / Mobile reference

PRIVATE DINING
07 Private Dining / Desktop
08 Private Dining / Mobile reference

GALLERY
09 Gallery / Desktop
10 Gallery / Mobile reference

RESERVATION
11 Search / Desktop
12 Search / Mobile
13 Availability / Desktop
14 Availability / Mobile
15 No Availability
16 Closed
17 Guest Details / Desktop
18 Guest Details / Mobile
19 Validation Error
20 Submitting
21 Slot Conflict
22 Generic Error
23 Confirmation / Desktop
24 Confirmation / Mobile

CONTACT
25 Contact / Desktop
26 Contact / Mobile

GLOBAL
27 Mobile Navigation Open
28 Footer / Desktop
29 Footer / Mobile
```

# 16. Content realism

High-fidelity comps should use:
- existing project copy.
- realistic dish names.
- real structural data.

Do not invent final:
- currency/timezone when project decisions conflict.
- dress code.
- awards.
- final policies.
