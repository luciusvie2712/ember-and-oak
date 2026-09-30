# EMBER & OAK — LAYOUT, GRID & SPACING

Status: **DESIGN BASELINE**

## 1. Responsive grid

### Large desktop

```text
viewport: ≥ 1440 reference
columns: 12
max content: 1280–1440
page margin: 64–80
gutter: 24
```

### Desktop / laptop

```text
columns: 12
page margin: 48–64
gutter: 24
```

### Tablet / compact

```text
columns: 8
page margin: 32
gutter: 20
```

### Mobile

```text
columns: 4
page margin: 20
gutter: 16
```

Exact breakpoints belong Phase 5 implementation after content stress-testing.

## 2. Editorial section rhythm

Default large section spacing:

```text
desktop: 128–160px
tablet:   96–128px
mobile:    72–96px
```

Dense operational sections such as Contact/Reservation may use smaller spacing.

## 3. Home layout ratios

### Hero

Desktop reference:

```text
text: 5 columns
gap/negative space: 1 column
media: 6 columns
```

Variation allowed for art direction.

### Philosophy

```text
heading/body: 5 columns
media: 6 columns
offset: 1 column
```

### Signature Menu

```text
menu list: 7 columns
featured image: 4 columns
offset/gap: 1 column
```

### Chef

```text
media: 6 columns
copy: 5 columns
offset: 1 column
```

## 4. Page intro

Most content pages:

```text
label
space-4
display heading
space-6
intro body
space-12/16
content
```

## 5. Reading width

Editorial paragraphs:
- use reading container around `640–720px`.

Operational text:
- may be narrower.

## 6. Full-width media

Atmosphere section may use:
- viewport-width image/video.
- safe overlay inset aligned to grid.

Do not crop away subject focal point.

## 7. Asymmetry rule

A page should contain deliberate rhythm changes.

Avoid:
```text
50/50
50/50
50/50
50/50
```

Prefer:
```text
5/7
full bleed
7/4 + offset
4/6 + offset
centered narrow CTA
```

## 8. Vertical alignment

Do not vertically center every split section.

Examples:
- text can align top third of image.
- quote can sit below image midpoint.
- small label can align above oversized heading.

## 9. Form layout

### Desktop reservation search

May use 3-column control row:
```text
Date / Guests / CTA
```

### Guest details

Maximum two fields side-by-side only when:
- labels remain clear,
- validation remains stable.

Special request:
- full-width.

### Mobile

Single column.

## 10. Sticky header allowance

Page top content must account for sticky header after scroll without hiding anchors/headings.

## 11. Sticky mobile CTA allowance

Public mobile pages need bottom padding equal to:
- CTA height
- safe area
- additional spacing.

Reservation route recommendation:
- hide global sticky Reserve CTA.

## 12. Gallery grid

Desktop:
- 12-column asymmetric placement.
- varied image spans.

Tablet:
- 8-column simplified asymmetry.

Mobile:
- 2-column or single-column rhythm depending asset crop.
- no horizontal overflow.

## 13. Admin layout

Admin is excluded from editorial asymmetry.

Use:
- stable application shell.
- responsive content width.
- tables/lists.
- predictable form grid.

## 14. Alignment anchors

Across public pages, maintain repeated anchor lines:
- logo edge.
- primary content left edge.
- section labels.
- footer grid.
- main CTA alignment.

Intentional overlaps may break grid visually while their base boxes still align to grid.
