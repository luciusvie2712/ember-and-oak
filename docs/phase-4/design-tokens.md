# EMBER & OAK — DESIGN TOKENS

Status: **ENGINEERING-READY DESIGN CONTRACT**

This file specifies semantic design values. Phase 5 may translate these into CSS variables, theme config or design-token files.

---

# 1. Color tokens

## 1.1 Brand palette

```text
color-charcoal-950    #171512
color-espresso-900    #1B1714
color-cream-100       #F1E9DB
color-cream-50        #F6F1E8
color-beige-400       #B8AA98
color-ember-500       #C66A3A
color-copper-500      #B8734A
```

## 1.2 Selected semantic baseline

```text
color-bg-primary        #171512
color-bg-secondary      #F1E9DB
color-bg-elevated       #1B1714

color-text-primary      #F6F1E8
color-text-secondary    #B8AA98
color-text-dark         #171512

color-accent            #C66A3A
color-accent-hover      #B8734A
```

## 1.3 Borders

```text
color-border-dark       rgba(246, 241, 232, 0.14)
color-border-dark-strong rgba(246, 241, 232, 0.28)

color-border-light      rgba(23, 21, 18, 0.16)
color-border-light-strong rgba(23, 21, 18, 0.32)
```

## 1.4 Overlay

```text
color-overlay-soft      rgba(23, 21, 18, 0.25)
color-overlay-medium    rgba(23, 21, 18, 0.48)
color-overlay-strong    rgba(23, 21, 18, 0.68)
```

Overlay strength depends on image contrast.

---

# 2. Contrast guidance

Approximate WCAG contrast for key pairs:

```text
#F6F1E8 on #171512  ≈ 16.20:1
#B8AA98 on #171512  ≈  8.02:1
#C66A3A on #171512  ≈  4.79:1
#171512 on #F1E9DB  ≈ 15.11:1
#171512 on #C66A3A  ≈  4.79:1
#F6F1E8 on #C66A3A  ≈  3.38:1
#C66A3A on #F1E9DB  ≈  3.15:1
```

Important:

- Use dark `#171512` text on the orange primary CTA.
- Do **not** use normal-size cream text on orange as the default.
- Do **not** use orange as normal body text on cream.
- Orange text on charcoal is acceptable for normal text at the baseline contrast, but should remain sparing.

---

# 3. Semantic utility colors — PROPOSED

These are not brand colors and should appear only in forms/admin/system feedback.

```text
color-success          #7F9C76
color-warning          #D0A35A
color-error            #D96C5F
color-info             #7C96A8
```

Always pair semantic color with:
- icon,
- label,
- status text,
- or another non-color cue.

Final accessibility contrast must be checked in component context.

---

# 4. Spacing scale

Base unit: `4px`.

```text
space-0      0
space-1      4px
space-2      8px
space-3      12px
space-4      16px
space-6      24px
space-8      32px
space-10     40px
space-12     48px
space-16     64px
space-20     80px
space-24     96px
space-32     128px
space-40     160px
```

Core project roadmap required:
- `space-1`
- `space-2`
- `space-3`
- `space-4`
- `space-6`
- `space-8`
- `space-12`
- `space-16`
- `space-24`

Additional values support editorial vertical rhythm.

---

# 5. Radius tokens

```text
radius-none      0
radius-xs        2px
radius-sm        4px
radius-pill      999px
```

Public site default:
`radius-none`.

Forms may use:
`radius-xs`.

---

# 6. Border width

```text
border-hairline  1px
border-active    2px
```

Avoid thick decorative borders.

---

# 7. Icon sizes

```text
icon-sm          16px
icon-md          20px
icon-lg          24px
icon-xl          32px
```

---

# 8. Control sizes

```text
control-sm       40px minimum height
control-md       48px minimum height
control-lg       56px minimum height
```

Primary reservation controls:
`48–56px`.

---

# 9. Container widths

```text
container-reading     720px
container-content     1120px
container-wide        1280px
container-max         1440px
```

Full-bleed media may exceed container.

---

# 10. Z-index semantic layers

Exact integers belong engineering implementation, but order must be:

```text
base content
sticky content
header
mobile sticky CTA
popover
drawer
modal
toast
```

Avoid arbitrary z-index escalation.

---

# 11. Opacity tokens

```text
opacity-muted        0.72
opacity-disabled     0.48
opacity-subtle       0.16
```

Disabled state must not rely solely on opacity if contrast/readability becomes insufficient.

---

# 12. Token naming rule

Prefer semantic tokens in application components.

Do:

```text
color-bg-primary
color-text-secondary
space-16
motion-base
```

Avoid:

```text
brown-thing
hero-gap-special
card-shadow-2
orange-button-only
```
