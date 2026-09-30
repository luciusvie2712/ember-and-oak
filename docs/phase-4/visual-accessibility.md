# EMBER & OAK — VISUAL ACCESSIBILITY SPEC

Status: **PHASE 4 VISUAL QA CONTRACT**

## 1. Color contrast

Approved key pairs:

```text
Cream White #F6F1E8 / Charcoal #171512
Muted Beige #B8AA98 / Charcoal #171512
Dark #171512 / Warm Cream #F1E9DB
Dark #171512 / Burnt Orange #C66A3A
```

Caution:
- cream text on orange does not provide enough contrast for normal body/button text at the baseline combination.
- orange normal text on cream is not the default.

## 2. Primary CTA

Use:
```text
background #C66A3A
text #171512
```

Focus:
- independent focus ring/outline.
- not only hover color.

## 3. Text over images

Required:
- image-specific contrast check.
- overlay where needed.
- avoid positioning text over high-detail focal region.

Do not assume one fixed overlay opacity works for every photograph.

## 4. Secondary text

Muted Beige on Charcoal is acceptable, but:
- do not reduce opacity further for important content.
- captions may be smaller but still readable.

## 5. Focus style

Every interactive element:
- obvious focus-visible state.
- contrast against both dark and cream surfaces.

Recommended concept:
- 2px high-contrast outline.
- 2px offset where visually possible.

Exact implementation token can be selected Phase 5.

## 6. Form error

Error needs:
- border/icon/text.
- message.
- programmatic association later.

Do not:
- only turn border red.

## 7. Selected time slot

Must show more than color:
- selected fill,
- text treatment,
- optional check/selected indicator,
- semantic selected state in implementation.

## 8. Disabled time slot

Must remain distinguishable from available:
- reduced prominence,
- non-interactive cursor/semantics,
- optionally strike/label only when needed.

Do not make disabled text unreadably faint.

## 9. Font sizes

Normal body:
- 16px baseline.

Critical form content:
- avoid below 14px.

Buttons:
- 14–16px minimum target.

Labels:
- 12px acceptable with strong contrast/tracking; not for long content.

## 10. Line length

Editorial body:
- 60–72 characters target.

Long lines reduce readability even with adequate font size.

## 11. Motion

Reduced-motion mode is required.

No information can:
- exist only during motion,
- require parallax to understand,
- disappear before user can read it.

## 12. Touch target

Controls should meet a comfortable minimum target.

Design baseline:
- 44px minimum practical target.
- reservation controls 48–56px.

## 13. Mobile sticky CTA

Needs:
- safe-area spacing.
- no obstruction.
- no overlap with focused input.
- enough bottom padding in document flow.

## 14. Gallery

If lightbox:
- visible controls.
- readable labels.
- close control obvious.
- contrast-safe backdrop.

## 15. Typography glyph QA

Check:
- Vietnamese diacritics if Vietnamese is used.
- punctuation.
- numerals.
- currency glyphs.
- uppercase tracking.

## 16. Visual QA gate

Before Phase 4 sign-off:
- all text/background pairs checked,
- media overlays reviewed,
- form states reviewed,
- focus styles present in comps,
- selected/disabled states non-color-only,
- mobile touch targets reviewed.
