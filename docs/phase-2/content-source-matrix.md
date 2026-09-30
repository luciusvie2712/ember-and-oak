# EMBER & OAK — CONTENT SOURCE MATRIX

Status: **DRAFT**

Purpose: mỗi UI section phải có canonical data source rõ ràng.

| Route / Section | Content source | Operational source | Transactional source | CMS editable |
|---|---|---|---|---|
| Header | SiteSettings | Contact optional | — | Yes |
| Footer | SiteSettings | Contact + Location | — | Yes |
| Home Hero | HomePage | — | — | Yes |
| Home Philosophy | HomePage | — | — | Yes |
| Home Signature Menu | Dish/MenuCategory | — | — | Yes via Menu |
| Home Atmosphere | HomePage + MediaAsset | — | — | Yes |
| Home Chef | ChefProfile | — | — | Yes |
| Home Experiences | DiningExperience | — | — | Yes |
| Home Location | — | Location + OpeningHours + Contact | — | Yes |
| Menu | Menu/MenuCategory/Dish | Currency config | — | Yes |
| Our Story | StoryPage + ChefProfile | — | — | Yes |
| Gallery | GalleryCategory/GalleryItem | — | — | Yes |
| Private Dining content | PrivateDiningPage/Experience | — | — | Yes |
| Private Dining enquiry | — | — | PrivateEventEnquiry | Content yes, submissions no |
| Reservations Search | — | OpeningHours/SpecialClosure config | Reservation domain | No |
| Availability | — | Hours/Closure | Reservation domain | No |
| Guest Details | — | — | Reservation/Customer | No |
| Confirmation | — | Contact/Location | Reservation | No |
| Contact page | PolicyContent | Location/Hours/Contact | — | Yes |
| SEO Restaurant schema | SiteSettings | Location/Hours/Contact | — | Partly |
| SEO Menu schema | Menu/Dish | Currency config | — | Derived |

---

# Canonical-source rules

## Contact

Email/phone/address must not be duplicated separately in:

- Home.
- Footer.
- Contact.
- Confirmation.

These surfaces reference canonical operational records.

## Opening Hours

Opening hours must not be copied into page rich text.

They must come from `OpeningHours`.

## Dish

Home featured dishes reference `Dish`.

Do not maintain a separate "home dish copy" unless the design later explicitly requires alternate editorial copy.

## Chef

Home and Story reference canonical `ChefProfile`.

## Private Dining capacity

Capacity values belong to `PrivateDiningExperience`, not hard-coded page text.

---

# Derived content

Some public output should be derived rather than CMS-entered:

```text
Formatted price
Formatted phone
Opening-hours display groups
Reservation confirmation date/time
Structured data
Canonical URL
```

Reason: avoids content drift.

---

# Data ownership

## Product/Content owner

Owns:
- Story copy.
- Menu descriptions.
- Chef content.
- Gallery.
- Private dining editorial copy.

## Restaurant operations

Owns:
- Opening hours.
- Special closures.
- Contact.
- Reservation policies.
- Menu availability/price if operational workflow requires.

## Reservation domain

Owns:
- Availability result.
- Booking status.
- Booking transaction.
- Customer reservation data.

CMS must not override reservation-domain truth.
