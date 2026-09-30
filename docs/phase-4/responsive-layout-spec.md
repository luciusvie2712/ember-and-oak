# EMBER & OAK — RESPONSIVE VISUAL SPECIFICATION

Status: **HIGH-FIDELITY RESPONSIVE CONTRACT**

## 1. Responsive philosophy

Do not scale desktop uniformly.

At smaller widths:
- reorder.
- stack.
- remove decorative overlap.
- simplify hover-driven visuals.
- preserve hierarchy.

## 2. Header

Desktop:
- inline nav.
- Reserve CTA.

Compact:
- reduce nav spacing before switching layout.

Mobile:
- brand + menu trigger.
- full menu drawer.
- sticky Reserve CTA on public content pages.

## 3. Hero

Desktop:
- oversized multi-line display.
- portrait media right.
- optional small overlap.

Tablet:
- reduce display scale.
- keep asymmetry if text remains readable.
- optional secondary media may disappear.

Mobile:
- title.
- body.
- CTAs.
- primary image.

No overlap required on mobile.

## 4. Philosophy

Desktop:
- text left / image offset right.

Mobile:
- section label.
- heading.
- body.
- image.

## 5. Signature Menu

Desktop:
- list + sticky/anchored featured image.

Mobile:
- menu list is dominant.
- one stable contextual image may appear above/below.
- no hover-only reveal.

## 6. Atmosphere

Desktop:
- viewport-wide immersive crop.

Mobile:
- portrait/4:5 or responsive crop if available.
- poster image preferred over heavy autoplay video.

## 7. Chef

Desktop:
- editorial split.

Mobile:
- portrait first.
- title/name.
- bio.
- quote.

## 8. Dining Experiences

Desktop:
- alternating compositions.

Mobile:
- one experience per vertical chapter.

## 9. Menu page

Desktop:
- generous category spacing.
- price aligned to right edge of row.

Mobile:
- dish name and price share top line where possible.
- description wraps below.
- long names may push price to own aligned line if required.

## 10. Gallery

Desktop:
- 3–4 visual tracks inside 12-col grid.

Tablet:
- 2–3 tracks.

Mobile:
- 1–2 tracks.
- preserve art direction rather than forcing identical squares.

## 11. Private Dining

Desktop:
- large alternating sections.

Mobile:
- media.
- capacity label.
- heading.
- body.
- CTA/form.

## 12. Reservation

Desktop:
- form width controlled, not full 1440.
- search controls horizontal.
- available slots form a compact grid.

Mobile:
- controls stacked.
- slot grid 2–3 columns depending text size.
- Guest Details single column.
- global sticky Reserve CTA hidden inside active flow.

## 13. Confirmation

Desktop:
- centered/narrow content with strong success heading and structured detail block.

Mobile:
- single-column details.
- Add to Calendar full-width/near full-width.

## 14. Contact

Desktop:
- Location and Hours columns.

Mobile:
- Location.
- Directions.
- Contact.
- Hours.
- Policies.

Order may prioritize practical information.

## 15. Footer

Desktop:
- large statement + grouped columns.

Mobile:
- large statement.
- stacked link groups.
- operational info.
- legal.

## 16. Admin

Desktop:
- table-first.

Tablet:
- condensed columns / horizontal scroll only where necessary.

Mobile:
- admin is secondary target; operational tables may become row detail/list layout rather than squeezing all columns.

## 17. Responsive image art direction

Different crop may be required for:
- Hero.
- Atmosphere.
- Private Dining.
- Chef portrait.

Use focal-point metadata.

Do not rely on `object-fit: cover` alone for all compositions.
