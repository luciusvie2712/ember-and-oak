# EMBER & OAK — PHASE 0 SCOPE

Status: **DRAFT BASELINE**

## 1. Product objective

EMBER & OAK là website fine-dining theo hướng **Modern Fine Dining + Editorial**, với ba trụ cột:

- Food.
- Story.
- Experience.

Conversion chính của website là **Reserve a Table**.

## 2. Release 1 route scope — CONFIRMED

```text
/
├── Home
├── Menu
├── Our Story
├── Private Dining
├── Gallery
├── Reservations
└── Contact
```

Route list trên được freeze cho Release 1 trừ khi có decision log mới.

## 3. MVP — MUST HAVE

### Public website

- Home.
- Menu.
- Our Story.
- Private Dining.
- Gallery.
- Reservations.
- Contact.
- Responsive desktop/tablet/mobile.
- Sticky/responsive navigation.
- Mobile sticky `Reserve a Table`.
- Footer.
- Opening hours / location / contact information.

### Reservation

- Search theo date + guest count.
- Hiển thị available time slots.
- Chọn slot.
- Guest information:
  - Name.
  - Email.
  - Phone.
  - Special request.
- Server-side validation.
- Reservation creation.
- Reservation confirmation.
- Reservation ID / code.
- Reservation status model.
- Revalidate availability tại thời điểm submit.
- Chống duplicate submit / double-book theo rule được chốt.

### Admin

- Secure admin authentication.
- Reservation list.
- Reservation detail.
- Reservation status update.
- Menu category/dish management.
- Content management cơ bản:
  - Home banner.
  - Restaurant story.
  - Chef profile.
  - Gallery.
  - Opening hours.
  - Contact information.

### Production readiness

- Basic technical SEO.
- Responsive image optimization.
- Lazy loading.
- Hero image preload.
- Font optimization.
- Error monitoring.
- Production logging.
- Security baseline.
- Accessibility baseline.
- Database backup/recovery procedure.

## 4. Recommended MVP additions — PROPOSED

Các mục dưới đây nên được nâng vào MVP vì ảnh hưởng trực tiếp đến operational correctness:

- Special closure / holiday closure.
- Reservation cancellation từ admin.
- Manual table assignment trong admin.
- Email reservation confirmation.
- Private dining enquiry persistence/delivery.

Lý do: nếu thiếu special closure hoặc cancellation, availability có thể hiển thị sai so với vận hành thực tế.

## 5. SHOULD HAVE — Release 1.1

- Guest self-service manage reservation.
- Event announcement.
- Customer reservation history.
- VIP tag.
- Private-event lead management nâng cao.
- Admin calendar view.
- Better table planning tools.
- Enhanced analytics.

## 6. COULD HAVE — Release 1.x

- Newsletter.
- Multi-language.
- Advanced CRM segmentation.
- Advanced conversion analytics.
- Advanced customer profiles.
- Automated table assignment.
- Marketing automation.

## 7. NOT NOW

Không đưa vào MVP nếu không có business decision mới:

- Payment/deposit flow.
- Loyalty program.
- Gift cards.
- Online food ordering/delivery.
- Native mobile app.
- Multi-location management.
- Real-time POS integration.
- Advanced personalization.

## 8. Explicit non-goals

EMBER & OAK **không** được triển khai như:

- SaaS dashboard-first website.
- Food delivery/order website.
- Card-grid-heavy restaurant template.
- Static brochure không có reservation workflow.
- Menu viewer đơn thuần.

## 9. UX constraints

- `Reserve a Table` phải luôn dễ tiếp cận.
- Home ưu tiên brand experience.
- Menu giữ editorial list.
- Photography là phần chính của visual language.
- Mobile không được chỉ scale desktop.
- Motion không được phá accessibility/performance.

## 10. Scope change rule

Mọi feature mới trong quá trình build phải:

1. Có business reason.
2. Được phân loại MUST / SHOULD / COULD / NOT NOW.
3. Có decision log.
4. Có đánh giá dependency.
5. Không được tự động chen vào MVP chỉ vì “dễ làm”.
