# EMBER & OAK — GLOBAL NAVIGATION WIREFRAMES

Status: **LOW-FIDELITY**

## 1. Desktop header — initial hero state

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ EMBER & OAK       Home   Menu   Our Story   Private Dining   Contact        │
│                                                     [ RESERVE A TABLE ]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Behavior:
- Transparent over Hero where contrast permits.
- Logo returns to Home.
- Reserve CTA remains visually primary.
- Current route gets accessible active state.

## 2. Desktop header — scrolled state

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ EMBER & OAK       Home   Menu   Our Story   Private Dining   Contact        │
│                                                     [ RESERVE A TABLE ]      │
└──────────────────────────────────────────────────────────────────────────────┘
──────── subtle divider ────────────────────────────────────────────────────────
```

Behavior:
- Sticky.
- Dark background.
- Light blur optional in visual phase.
- No layout jump when state changes.

## 3. Mobile header

```text
┌───────────────────────────────┐
│ EMBER & OAK              [≡]  │
└───────────────────────────────┘
```

## 4. Mobile navigation open

```text
┌───────────────────────────────┐
│ EMBER & OAK              [×]  │
├───────────────────────────────┤
│ HOME                          │
│ MENU                          │
│ OUR STORY                     │
│ PRIVATE DINING                │
│ CONTACT                       │
│                               │
│ [ RESERVE A TABLE ]           │
└───────────────────────────────┘
```

Interaction requirements:
- Focus enters menu on open.
- Escape closes menu.
- Focus returns to trigger on close.
- Background scroll locked while menu open.
- Route change closes menu.
- Menu works without animation.

## 5. Mobile sticky reservation CTA

```text
┌───────────────────────────────┐
│ page content                  │
│ ...                           │
│                               │
├───────────────────────────────┤
│     [ RESERVE A TABLE ]       │
└───────────────────────────────┘
```

Rules:
- Respect device safe-area.
- Do not cover important content.
- On Reservations route, sticky CTA may transform into contextual progress/submit behavior only if Phase 4 UX approves; default is to hide it to avoid duplicate primary action.

## 6. Footer

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ COME HUNGRY.                                                                │
│ LEAVE INSPIRED.                                                             │
│                                                                              │
│ OUR STORY        VISIT             RESERVATIONS         FOLLOW              │
│ Menu             Address           Reserve              Instagram           │
│ Private Dining   Hours             Contact              Facebook            │
│ Contact          Phone                                                     │
│                  Email                                                     │
│                                                                              │
│ © EMBER & OAK                         Privacy   Terms                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Rules:
- Operational data comes from canonical source.
- Hide social links when URL is not confirmed.
- Footer remains readable without decorative motion.

## 7. Keyboard order

Desktop:

```text
Logo
→ Home
→ Menu
→ Our Story
→ Private Dining
→ Contact
→ Reserve CTA
→ page content
```

Mobile closed:

```text
Logo
→ Menu trigger
→ page content
→ sticky Reserve CTA
```

Mobile open:

```text
Close trigger
→ Home
→ Menu
→ Our Story
→ Private Dining
→ Contact
→ Reserve CTA
```
