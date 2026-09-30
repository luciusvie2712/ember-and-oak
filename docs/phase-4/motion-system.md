# EMBER & OAK — MOTION SYSTEM

Status: **DESIGN TOKEN BASELINE**

## 1. Motion tokens

```text
motion-instant     100ms
motion-fast        180ms
motion-base        320ms
motion-slow        520ms
motion-editorial   720ms
```

## 2. Easing

Conceptual baseline:

```text
ease-standard      cubic-bezier(0.2, 0.0, 0.2, 1)
ease-enter         cubic-bezier(0.16, 1, 0.3, 1)
ease-exit          cubic-bezier(0.4, 0, 1, 1)
ease-editorial     cubic-bezier(0.22, 1, 0.36, 1)
```

Engineering may normalize exact curves while preserving intent.

## 3. Scroll reveal

### Text

```text
opacity: 0 → 1
translateY: 16–24px → 0
duration: motion-slow
ease: ease-enter
```

### Media

```text
clip/mask reveal
duration: motion-editorial
ease: ease-editorial
```

Do not trigger excessive stagger on every paragraph.

## 4. Header transition

Transparent → dark sticky:

```text
background transition: motion-base
border transition: motion-base
backdrop effect: motion-base
```

Header geometry must remain stable.

## 5. Menu row

Hover/focus:

```text
index color        motion-fast
text translate     4–8px / motion-base
image crossfade    motion-base or motion-slow
```

Do not animate row height.

## 6. Button

Primary CTA:
- background slide or color transition.
- arrow translate 4px max.

Duration:
`motion-fast` to `motion-base`.

## 7. Link underline

- animate scale/width.
- fast/base duration.
- focus state must appear immediately enough for keyboard orientation.

## 8. Mobile nav

Open:
- opacity + slight translate.
- `motion-base`.

Close:
- `motion-fast`.

Focus placement must not wait until full visual animation ends.

## 9. Form states

Focus:
- `motion-fast`.

Error:
- border/text transition.
- no shake.

Loading:
- subtle progress treatment.
- no looping distracting animation.

## 10. Gallery lightbox

If implemented:
- backdrop fade.
- media scale only slightly.
- avoid dramatic zoom.

## 11. Reduced motion

Under `prefers-reduced-motion`:

```text
scroll reveal      remove translate/clip; optional simple fade or instant
image reveal       instant
parallax           disabled
menu image motion  direct swap or minimal fade
drawer             minimal/instant
button arrow       no travel required
```

## 12. Mobile degradation

Mobile should reduce:
- layered parallax.
- multiple overlapping animated images.
- autoplay motion.
- long reveal sequences.

## 13. Performance rules

Prefer animation of:
- transform.
- opacity.

Avoid:
- width/height layout animation.
- continuous scroll-linked JS without strong reason.
- full-page animation frameworks purely for decoration.
