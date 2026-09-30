# EMBER & OAK — CONTENT PAGE LOW-FIDELITY WIREFRAMES

Status: **READY FOR VISUAL DESIGN**

# 1. Menu

## Desktop

```text
HEADER

MENU
Seasonal / intro copy

[ category nav / anchors ]

STARTERS
────────────────────────────────────────────────────────────
DISH NAME                                      PRICE
description
────────────────────────────────────────────────────────────
DISH NAME                                      PRICE
description
────────────────────────────────────────────────────────────

MAINS
────────────────────────────────────────────────────────────
...

                     [ RESERVE A TABLE ]

FOOTER
```

Rules:
- Category navigation assists scanning but is not required to see content.
- All critical dish text remains visible/indexable.
- Availability state must not rely on color alone.
- Touch/mobile must not require dish hover.

## Mobile

```text
MENU
intro

[category jump control]

STARTERS

01
DISH NAME                         PRICE
description

02
DISH NAME                         PRICE
description

...

[RESERVE A TABLE]
```

---

# 2. Our Story

## Desktop

```text
HEADER

INTRO
large statement + media

ORIGIN
editorial copy         media

FOUNDERS
media                  copy

EXECUTIVE CHEF
large image            story / quote

PHILOSOPHY
large typography

SOURCING
copy + ingredient media

SUSTAINABILITY
copy + supporting media

RESTAURANT DESIGN
interior media + story

[ RESERVE A TABLE ]

FOOTER
```

Rules:
- Story order follows content hierarchy.
- Optional sections may collapse cleanly.
- Avoid corporate timeline unless content later specifically requires one.

---

# 3. Private Dining

## Desktop

```text
HEADER

PRIVATE DINING
hero media
intro

PRIVATE ROOM
large media
12–20 guests
description

CHEF'S TABLE
large media
6–8 guests
description

FULL RESTAURANT BUYOUT
large media
up to 80 guests
description

PLAN YOUR EVENT
Name
Email
Phone
Event Date
Guests
Event Type
Budget
Message

[ SUBMIT ENQUIRY ]

FOOTER
```

### Form states

- Default.
- Validation error.
- Submitting.
- Success.
- Server/network failure.

Do not merge private-event enquiry with regular reservation flow.

---

# 4. Gallery

## Desktop

```text
HEADER

GALLERY
intro

[ Food ] [ Chef ] [ Ingredients ] [ Kitchen ] [ Dining Room ] [ Wine ] [ Guests ]

┌──────────────┐ ┌─────────────────────────┐
│              │ │                         │
│ image        │ │ wide image              │
│              │ │                         │
└──────────────┘ └─────────────────────────┘

        ┌─────────────────┐
        │ tall image      │ ┌──────────────┐
        │                 │ │ image        │
        │                 │ └──────────────┘
        └─────────────────┘

[ RESERVE A TABLE ]

FOOTER
```

Rules:
- Masonry/asymmetric.
- Filter/category behavior must not strand keyboard users.
- If lightbox is added in Phase 4, it must define focus trap, Escape and next/previous keyboard behavior.

## Mobile

Use stacked varied-ratio grid without horizontal overflow.

---

# 5. Contact

## Desktop

```text
HEADER

CONTACT / VISIT

┌────────────────────────────────┬───────────────────────────────────────────┐
│ LOCATION                       │ OPENING HOURS                            │
│ Restaurant Name                │ Tuesday–Thursday                         │
│ Address                        │ ...                                      │
│                                │ Friday–Saturday                          │
│ [ GET DIRECTIONS ]             │ ...                                      │
│                                │ Sunday                                   │
│ EMAIL                          │ ...                                      │
│ PHONE                          │ Monday Closed                            │
└────────────────────────────────┴───────────────────────────────────────────┘

POLICIES
Dress code
Reservation policy
Cancellation policy

[ RESERVE A TABLE ]

FOOTER
```

Rules:
- Unconfirmed policies remain hidden/draft.
- Address/contact/hours must come from canonical source.

---

# 6. Cross-page ending pattern

Preferred ending for content pages:

```text
content conclusion
↓
contextual CTA
↓
operational reassurance if needed
↓
footer
```

Avoid ending with:
- empty image.
- social links only.
- no next action.
