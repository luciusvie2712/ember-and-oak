# EMBER & OAK — DESIGN HANDOFF TO ENGINEERING

Status: **PHASE 5 INPUT CONTRACT**

## 1. What engineering receives

### Tokens
- color.
- typography.
- spacing.
- radii.
- control sizes.
- motion.
- layout/container rules.

### Components
- variants.
- states.
- responsive behavior.
- accessibility requirements.

### Screens
- desktop.
- mobile.
- loading/error/empty states.
- reservation conflict flow.
- admin reference screens.

## 2. Expected Phase 5 implementation mapping

Design concepts should become something equivalent to:

```text
tokens
components
layouts
motion primitives
media primitives
form primitives
```

The implementation technology is not dictated by Phase 4.

## 3. Engineering must not invent

Engineering should not need to decide:
- primary/accent color.
- body/display role.
- button hierarchy.
- time-slot selected styling.
- desktop/mobile layout behavior.
- motion timing category.
- focus visibility expectation.
- page section order.

## 4. Engineering may decide

Phase 5 may decide:
- framework.
- monorepo structure.
- CSS strategy.
- token serialization.
- component file organization.
- animation library vs native CSS.
- exact breakpoint values after stress testing.
- CMS technology.
- image pipeline vendor.

Provided that design behavior remains intact.

## 5. Responsive implementation rule

Breakpoints are an implementation detail.

Design behavior is the contract:

```text
inline nav → mobile menu
split hero → stacked hero
menu + hover image → readable mobile list
alternating experiences → vertical chapters
horizontal reservation search → vertical search
```

## 6. Asset handling

Engineering must preserve:
- focal point.
- aspect ratio.
- known dimensions.
- responsive delivery.
- preload only critical hero.
- lazy load below fold.

## 7. Font handling

Use:
- minimal required weights.
- sensible fallback.
- font-display strategy.
- subset optimization where available.

Do not load every font weight/style.

## 8. Motion implementation

Prefer:
- CSS transforms/opacity for simple effects.
- minimal JS.

Do not introduce a large animation dependency unless justified by multiple required interactions.

## 9. Accessibility handoff

Implementation must preserve:
- semantic navigation.
- skip link.
- focus-visible.
- reduced motion.
- field labels.
- error association.
- keyboard slot selection.
- drawer focus handling.
- dialog focus trap.

## 10. Design QA process

Recommended:

```text
implementation
→ local visual QA
→ responsive QA
→ keyboard QA
→ design comparison
→ staging review
```

## 11. Visual regression candidates

Prioritize:
- Header states.
- Home Hero desktop/mobile.
- Signature Menu.
- Menu row.
- Reservation Search.
- Time slots.
- Guest Details.
- Confirmation.
- Mobile nav.
- Gallery grid.

## 12. Open business decisions

Engineering must not use visual placeholders as business truth for:
- currency.
- timezone.
- reservation duration.
- guest limit.
- booking window.
- cancellation policy.
- dress code.
- production address/contact.

These remain product/domain inputs.
