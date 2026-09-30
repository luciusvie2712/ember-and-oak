# EMBER & OAK — TYPOGRAPHY SYSTEM

Status: **DESIGN BASELINE**

## 1. Typeface roles

### Display / editorial

Baseline family:

```text
Cormorant Garamond
```

Source-approved alternatives:
- Playfair Display.
- DM Serif Display.
- Libre Baskerville.

Use for:
- Hero.
- Section heading.
- Editorial quote.
- Menu page title.
- Large campaign statement.

### UI / body

Baseline family:

```text
Inter
```

Source-approved alternatives:
- Manrope.
- DM Sans.
- Neue Haas Grotesk where licensing permits.

Use for:
- Navigation.
- Buttons.
- Body copy.
- Forms.
- Labels.
- Metadata.
- Admin.

## 2. Weight strategy

Display:
- Regular 400.
- Medium 500 optional.

Avoid using bold display everywhere.

UI/body:
- Regular 400.
- Medium 500.
- Semibold 600 for compact emphasis.

Avoid unnecessary 700/800 unless accessibility/readability requires it.

## 3. Type scale

Values below are design targets; implementation may use fluid interpolation while preserving bounds.

| Token | Desktop target | Mobile target | Line-height | Role |
|---|---:|---:|---:|---|
| display-xl | 128px | 64px | 0.90–0.94 | Home hero |
| display-lg | 96px | 52px | 0.94–1.00 | Page hero |
| heading-1 | 72px | 44px | 1.00 | Major section |
| heading-2 | 52px | 36px | 1.05 | Section |
| heading-3 | 34px | 28px | 1.12 | Subsection |
| body-lg | 20px | 18px | 1.55 | Intro |
| body | 16px | 16px | 1.65 | Main copy |
| body-sm | 14px | 14px | 1.55 | Metadata |
| label | 12px | 12px | 1.30 | Eyebrow / UI label |
| caption | 12px | 12px | 1.45 | Supporting metadata |

## 4. Tracking

Display:
```text
-0.03em to -0.01em
```

Heading:
```text
-0.02em to 0
```

Body:
```text
0
```

Label:
```text
0.08em to 0.14em
```

Uppercase label should have additional letter spacing.

## 5. Hero typography

Hero:

```text
SEASONAL
DINING,
REFINED.
```

Rules:
- Display serif.
- Tight leading.
- Large enough to establish editorial identity.
- Must not collide with portrait media.
- Use manual line breaks only where design intentionally controls composition.
- Mobile break may differ from desktop.

## 6. Section labels

Example:

```text
OUR PHILOSOPHY
SIGNATURE MENU
EXECUTIVE CHEF
```

Style:
- UI sans.
- 12px.
- uppercase.
- wide tracking.
- muted beige or accent.
- not visually louder than heading.

## 7. Body reading width

Long narrative copy:
- recommended max `60–72 characters` per line.

Do not run long story paragraphs across full desktop width.

## 8. Menu typography

Dish name:
- UI or editorial serif depending final composition.
- strong hierarchy.
- uppercase optional but not mandatory.

Description:
- body-sm/body.
- secondary text.

Price:
- UI sans.
- tabular numerals if supported.
- aligned visually without making menu feel like a spreadsheet.

## 9. Reservation typography

Prioritize clarity over editorial flourish.

Use:
- serif for reservation page headline.
- sans-serif for field labels, values, slot times, errors, helper text.

## 10. Admin typography

Use sans-serif almost exclusively.

Display serif may appear only in:
- brand mark,
- non-essential decorative identity.

Admin data tables/forms should not use editorial serif for operational content.

## 11. Vietnamese and English support

Typography QA must check:
- Vietnamese diacritics.
- English uppercase labels.
- mixed numeric/currency formatting.
- long translated strings if bilingual content later becomes active.

Do not approve a font if Vietnamese glyph quality is poor.

## 12. Font loading target

Phase 5 implementation should aim to:
- limit required font files.
- use only required weights.
- avoid blocking the first paint.
- use sensible fallback stacks.
- prevent major layout shift.

## 13. Fallback concept

Display fallback:
```text
Georgia, "Times New Roman", serif
```

UI fallback:
```text
system-ui, -apple-system, "Segoe UI", sans-serif
```

Exact implementation belongs Phase 5.
