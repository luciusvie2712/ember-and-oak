# EMBER & OAK — INTERACTION & MOTION UX SPEC

Status: **BEHAVIORAL SPEC; FINAL TIMINGS DEFERRED TO PHASE 4**

## 1. Motion purpose

Motion may:
- Reveal hierarchy.
- Reinforce editorial pacing.
- Connect menu row to dish image.
- Clarify button/navigation state.

Motion must not:
- Delay core actions.
- Hide information unnecessarily.
- Block keyboard use.
- cause motion-sensitive users difficulty.

## 2. Scroll reveal

Eligible:
- Section heading.
- Supporting copy.
- Editorial media.

Behavior concept:
- Fade.
- Small translate Y.
- Optional clip reveal for media.

Rules:
- Trigger once or predictably.
- Content remains accessible without JS animation.
- Reduced-motion removes spatial movement.

## 3. Image reveal

Concept:
- Mask/clip reveal.

Do not:
- animate image dimensions causing layout shift.
- leave alt text/content inaccessible while animation is incomplete.

## 4. Signature Menu hover/focus

Desktop pointer:

```text
row hover
→ index accent
→ subtle text shift
→ corresponding image transition
```

Keyboard:

```text
row focus
→ equivalent active image/content state
```

Touch:
- no hover requirement.
- tapping a row should not unexpectedly navigate unless row is explicitly a link.

## 5. Buttons

Possible Phase 4 visual treatment:
- background slide.
- arrow movement.
- underline movement.

UX rule:
- button label remains stable/readable.
- motion cannot be only signal for active/focus.

## 6. Navigation

Active route may use:
- dot.
- underline.
- accent.

Accessibility:
- semantic current-page indication should not depend only on visual treatment.

## 7. Mobile navigation

Open/close motion:
- short.
- reversible.
- does not delay focus placement.

Reduced motion:
- instant/near-instant state change.

## 8. Form interaction

Validation:
- no shake animation required.
- error appearance should not move focus unpredictably.

Submitting:
- button state changes.
- optional subtle progress indicator.
- label can change to submitting state.

Success:
- no confetti/celebratory motion required.
- confirmation clarity is more important.

## 9. Gallery

If Phase 4 adds lightbox:
- open transition optional.
- focus trap required.
- Escape required.
- reduced-motion fallback required.

## 10. Motion token placeholders

Final values deferred, but design system should later define concepts such as:

```text
motion-fast
motion-base
motion-slow

ease-standard
ease-emphasized
```

Do not put one-off arbitrary durations in every component.

## 11. Performance constraints

Avoid:
- large JS scroll animation dependency without clear value.
- continuous parallax on all sections.
- autoplay video on mobile.
- animating layout-heavy properties when transform/opacity alternatives exist.

## 12. Reduced motion

Under `prefers-reduced-motion`:

- Disable clip/travel-heavy reveals.
- Remove parallax.
- Minimize menu image cross-motion.
- Keep state changes immediate and understandable.
