# EMBER & OAK — ACCESSIBILITY UX SPEC

Status: **PHASE 3 ACCESSIBILITY CONTRACT**

## 1. Scope

Accessibility requirements are part of UX definition, not post-build cleanup.

## 2. Global navigation

- Skip-to-content affordance.
- Semantic navigation landmark.
- Current page programmatically identifiable.
- Mobile drawer focus management.
- Escape closes modal-like drawer.
- Focus restored to trigger.

## 3. Headings

Each page:
- One clear primary page heading.
- Section headings follow logical hierarchy.
- Typography size does not determine semantic level.

## 4. Links vs buttons

Use link for:
- navigation.

Use button for:
- actions/state changes.

Do not style generic containers as interactive controls without semantics.

## 5. Focus

All interactive controls:
- visible focus.
- sensible order.
- no keyboard trap except intentional modal focus trap.

## 6. Forms

Each input:
- visible/persistent label.
- programmatic label association.
- required status communicated.
- errors associated to field.
- examples/hints not used as sole labels.

## 7. Reservation slots

Slots must:
- be keyboard selectable.
- communicate selected state.
- communicate disabled state.
- not rely only on color.

Implementation may later choose:
- radio-group semantics,
- button group with selected state,
provided behavior is accessible.

## 8. Validation

When submit fails validation:
- identify errors clearly.
- move/focus to summary or first invalid field when appropriate.
- do not erase valid values.

## 9. Loading

Availability search:
- loading state visible.
- assistive technology can receive meaningful status update if needed.
- form remains understandable.

## 10. Confirmation

Success:
- confirmation heading receives logical focus/announcement after transition.
- reservation details use structured semantic content.
- do not expose operational/internal fields.

## 11. Images

Informative:
- meaningful alt.

Decorative:
- explicitly decorative.

Do not stuff alt text with:
- SEO keywords.
- filename.
- duplicated nearby caption unless necessary.

## 12. Video

If meaningful speech exists:
- captions required.

Autoplay:
- must not produce unexpected audio.
- heavy autoplay on mobile prohibited.

## 13. Motion

Respect reduced-motion.

No critical information may exist only during animation.

## 14. Contrast

Final color contrast belongs Phase 4 visual QA, but Phase 3 requires:
- text readable over media,
- overlay has sufficient treatment,
- disabled/selected/error states not color-only.

## 15. Touch targets

Primary controls:
- sufficiently large for touch.
- enough spacing to avoid accidental activation.

Exact dimensions finalized with design system.

## 16. Sticky mobile CTA

Must:
- not cover focused controls.
- not cover validation messages.
- allow page zoom.
- respect safe-area.

## 17. Gallery/lightbox

If lightbox used:
- focus enters.
- focus trapped appropriately.
- Escape closes.
- focus returns.
- next/previous controls labeled.

## 18. Accessibility UX acceptance gate

Before Phase 4 handoff:
- navigation keyboard path defined,
- reservation keyboard path defined,
- errors defined,
- selected/disabled slot semantics defined,
- reduced-motion behavior defined.
