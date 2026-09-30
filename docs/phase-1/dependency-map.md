# EMBER & OAK — PHASE 1 DEPENDENCY MAP

## 1. Product dependency

```mermaid
flowchart TD
    P0[Phase 0 Decisions]
    IA[Phase 2 IA & Content Model]
    UX[Phase 3 UX]
    DS[Phase 4 Design System]
    TF[Phase 5 Technical Foundation]

    NAV[Navigation]
    HOME[Home]
    MENU[Menu]
    STORY[Story]
    GALLERY[Gallery]
    PRIVATE[Private Dining]
    CONTACT[Contact]

    RBE[Reservation Backend]
    RFE[Reservation Frontend]
    ARES[Admin Reservations]
    ACMS[Admin Menu/Content]

    PROD[SEO/A11y/Performance/Observability]

    P0 --> IA
    P0 --> UX
    P0 --> RBE

    IA --> MENU
    IA --> ACMS
    IA --> RBE

    UX --> DS
    DS --> NAV
    DS --> HOME
    DS --> MENU
    DS --> STORY
    DS --> GALLERY
    DS --> PRIVATE
    DS --> CONTACT
    DS --> RFE

    TF --> NAV
    TF --> RBE
    TF --> ACMS
    TF --> ARES

    RBE --> RFE
    RBE --> ARES
    ACMS --> MENU
    ACMS --> STORY
    ACMS --> GALLERY
    ACMS --> CONTACT

    NAV --> HOME
    MENU --> HOME

    HOME --> PROD
    MENU --> PROD
    STORY --> PROD
    GALLERY --> PROD
    PRIVATE --> PROD
    CONTACT --> PROD
    RFE --> PROD
    ARES --> PROD
```

## 2. Phase 0 blockers affecting backlog

| Decision | Affected tickets |
|---|---|
| DEC-0008 Currency | Menu pricing formatting, admin menu validation |
| DEC-0009 Timezone | Availability, confirmation, admin schedule |
| DEC-0011 Dining duration | Availability engine |
| DEC-0012 Guest range | Reservation search/validation |
| DEC-0013 Booking window | Reservation search/availability |
| DEC-0014 Same-day cutoff | Availability |
| DEC-0015 Cancellation cutoff | Manage/cancel workflow |
| DEC-0019 Availability model | Capacity/table schema + engine |
| DEC-0020 Dress code | Contact/policy content |
| DEC-0022 Production contact/address | Contact + SEO structured data |

## 3. Cross-cutting constraints

### Reservation
Không triển khai final domain model trước DEC-0009, DEC-0011, DEC-0012, DEC-0013, DEC-0014, DEC-0019.

### Menu
UI có thể build với fixture data; production persistence phụ thuộc Phase 2 content model.

### Home
Có thể build structure sau Phase 4; Signature Menu preview phụ thuộc Menu data contract.

### SEO
Metadata framework có thể làm sớm; structured data production phụ thuộc contact/location/content thật.

### Admin
Không được tự có business logic khác backend domain service.
