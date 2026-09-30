# EMBER & OAK — HOME LOW-FIDELITY WIREFRAME

Status: **READY FOR PHASE 4 VISUAL DESIGN**

## Desktop

### 1. Hero

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                       │
├───────────────────────────────────┬──────────────────────────────────────────┤
│                                   │                                          │
│ SEASONAL                          │          PRIMARY SIGNATURE IMAGE         │
│ DINING,                           │                                          │
│ REFINED.                          │                                          │
│                                   │               ┌──────────────┐           │
│ Contemporary cuisine inspired... │               │ optional      │           │
│                                   │               │ overlap media│           │
│ [ VIEW MENU ] [ RESERVE TABLE ]  │               └──────────────┘           │
│                                   │                                          │
│ optional location / established  │                                          │
└───────────────────────────────────┴──────────────────────────────────────────┘
```

UX notes:
- Reserve and View Menu are the only major Hero actions.
- Avoid award badges unless verified.
- Primary media must remain understandable under responsive crop.

---

### 2. Philosophy

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ OUR PHILOSOPHY                                                              │
│                                                                              │
│ Simple ingredients.                  ┌────────────────────────────────────┐  │
│ Unexpected experiences.             │ supporting ingredient / fire      │  │
│                                     │ / chef image                      │  │
│ Body copy about seasonality,        │                                    │  │
│ sourcing and open-fire cooking.     └────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Signature Menu

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIGNATURE MENU                                      FEATURED DISH IMAGE      │
│                                                                              │
│ 01  CHARRED OCTOPUS                         PRICE   ┌─────────────────────┐  │
│     description                                     │                     │  │
│ ─────────────────────────────────────────────────   │                     │  │
│ 02  DUCK BREAST                            PRICE    │ dynamic on hover /  │  │
│     description                                     │ focus               │  │
│ ─────────────────────────────────────────────────   │                     │  │
│ 03  BLACK COD                              PRICE    │                     │  │
│     description                                     └─────────────────────┘  │
│                                                                              │
│ [ EXPLORE FULL MENU ]                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Interaction:
- Pointer hover can change image.
- Keyboard focus must produce equivalent useful state.
- Touch should show a stable image without requiring hover.
- Menu rows are not cards.

---

### 4. Atmosphere

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                       FULL-WIDTH ATMOSPHERE MEDIA                            │
│                                                                              │
│             MORE THAN DINNER.                                                │
│             AN EVENING TO REMEMBER.                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

If video:
- poster fallback required.
- no heavy autoplay on mobile.
- reduced-motion fallback.

---

### 5. Chef Story

```text
┌────────────────────────────────────────┬─────────────────────────────────────┐
│                                        │ EXECUTIVE CHEF                      │
│             CHEF IMAGE                 │                                     │
│                                        │ Name                                │
│                                        │ Background / Philosophy             │
│                                        │                                     │
│                                        │ “Cooking begins with respect...”    │
│                                        │ optional signature                  │
└────────────────────────────────────────┴─────────────────────────────────────┘
```

---

### 6. Dining Experiences

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ DINING EXPERIENCES                                                           │
│                                                                              │
│ ┌───────────────────────────────┐   Chef's Tasting Menu                     │
│ │ large editorial media        │   description / price label               │
│ └───────────────────────────────┘                                           │
│                                                                              │
│                    Wine Pairing                ┌───────────────────────────┐ │
│                    description                 │ large editorial media    │ │
│                                               └───────────────────────────┘ │
│                                                                              │
│ ┌───────────────────────────────┐   Private Dining                          │
│ │ large editorial media        │   description / CTA                       │
│ └───────────────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

Do not turn this into three small equal cards.

---

### 7. Reservation CTA

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                         RESERVE YOUR TABLE                                   │
│                    short confidence-building copy                            │
│                                                                              │
│                         [ RESERVE A TABLE ]                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 8. Location Summary

```text
┌────────────────────────────────────────┬─────────────────────────────────────┐
│ LOCATION                               │ OPENING HOURS                       │
│ Restaurant Name                        │ Tue–Thu ...                         │
│ Address                                │ Fri–Sat ...                         │
│                                        │ Sun ...                             │
│ [ GET DIRECTIONS ]                     │ Mon Closed                          │
│                                        │                                     │
│ Email                                  │ [ RESERVE A TABLE ]                 │
│ Phone                                  │                                     │
└────────────────────────────────────────┴─────────────────────────────────────┘
```

Operational data must come from canonical records.

---

## Mobile Home

```text
HEADER
↓
HERO TITLE
DESCRIPTION
[VIEW MENU]
[RESERVE]
PRIMARY IMAGE
↓
PHILOSOPHY
IMAGE
↓
SIGNATURE MENU
dish 01
dish 02
dish 03
[EXPLORE MENU]
↓
ATMOSPHERE IMAGE/POSTER
↓
CHEF IMAGE
CHEF STORY
↓
DINING EXPERIENCES
large stacked editorial blocks
↓
RESERVATION CTA
↓
LOCATION / HOURS
↓
FOOTER

[sticky Reserve CTA]
```

Mobile rules:
- Do not preserve desktop split if it causes cramped text.
- Menu prices remain scan-friendly.
- No hover dependency.
- Sticky CTA must not overlap footer controls or reservation form.
