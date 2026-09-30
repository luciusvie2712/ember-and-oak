# EMBER & OAK — PHASE 0 BUSINESS RULES

Status: **DRAFT BASELINE**

## 1. Restaurant model

| Rule | Value | Status |
|---|---|---|
| Location model | Single-location MVP | PROPOSED |
| Address | 41/22 Pham Ngu Lao, Phuong Hanh Thong, Tp.HCM | CONFIRMED FROM SOURCE |
| Currency | VND | PROPOSED |
| Restaurant timezone | `Asia/Ho_Chi_Minh` | PROPOSED / NEEDS CONFIRMATION |
| Primary language | Vietnamese | PROPOSED |
| Multi-language | English | PROPOSED |

### Notes

Currency `VND` và số điện thoại `+84` phù hợp với VND/Ho Chi Minh City

---

## 2. Opening hours

Baseline hiện tại:

```text
TUESDAY — THURSDAY
17:30 — 22:30

FRIDAY — SATURDAY
17:30 — 23:30

SUNDAY
17:00 — 22:00

MONDAY
Closed
```

Status: **CONFIRMED FROM SOURCE**

### Operational rule

Availability engine phải dựa vào opening hours được quản lý từ dữ liệu, không hard-code trực tiếp vào UI.

---

## 3. Reservation status model

Status cố định:

```text
PENDING
CONFIRMED
SEATED
COMPLETED
CANCELLED
NO_SHOW
```

Status: **CONFIRMED**

### Allowed transitions — PROPOSED

```text
PENDING   -> CONFIRMED
PENDING   -> CANCELLED

CONFIRMED -> SEATED
CONFIRMED -> CANCELLED
CONFIRMED -> NO_SHOW

SEATED    -> COMPLETED
```

Forbidden examples:

```text
COMPLETED -> PENDING
CANCELLED -> SEATED
NO_SHOW   -> CONFIRMED
```

Nếu cần reopen/recover record, nên dùng admin operation có audit log thay vì thay status tùy ý.

---

## 4. Reservation slot policy

| Rule | Proposed value | Status |
|---|---:|---|
| Slot interval | 30 minutes | PROPOSED |
| Standard dining duration | 120 minutes | OPEN / PROPOSED |
| Online guest min | 1 | PROPOSED |
| Online guest max | 8 | PROPOSED |
| Parties > 8 | Route to Private Dining / contact | PROPOSED |
| Booking window | 30 days ahead | OPEN / PROPOSED |
| Same-day cutoff | 2 hours before slot | OPEN / PROPOSED |
| Grace period for arrival | 15 minutes | OPEN / PROPOSED |
| Buffer between turns | 0–15 minutes depending table plan | OPEN |

### Rationale

- Source hiển thị slot ví dụ cách nhau 30 phút.
- Source có Chef's Table `6–8 guests`, Private Room `12–20 guests`, Full Buyout `up to 80`.
- Giới hạn regular online reservation chưa được source định nghĩa.

---

## 5. Availability calculation

Availability phải xét:

1. Restaurant opening hours.
2. Special closure.
3. Requested date.
4. Requested guest count.
5. Existing active reservations.
6. Table/capacity availability nếu table assignment được bật.
7. Booking window.
8. Reservation duration.
9. Slot interval.
10. Optional buffer time.

### Server authority

Frontend chỉ hiển thị availability tạm thời.

Khi tạo reservation:

1. Server validate input.
2. Server re-check availability.
3. Thực hiện trong transaction/locking strategy phù hợp.
4. Chống duplicate request.
5. Chỉ khi thành công mới trả confirmation.

Status: **CONFIRMED AS ENGINEERING RULE**

---

## 6. Table assignment

### MVP proposal

- Admin có thể gán table thủ công.
- Availability không phụ thuộc hoàn toàn vào client.
- Automated table optimization để sau MVP.

Status: **PROPOSED**

### Open decision

Cần chốt một trong hai model:

**Model A — Table-aware availability**
- Mọi table được model hóa.
- Booking chỉ available khi có table hoặc combination phù hợp.

**Model B — Service capacity first**
- Availability dựa trên tổng cover capacity theo slot.
- Host gán table sau.

Recommendation cho MVP: **Model A nếu restaurant có sơ đồ bàn ổn định; Model B nếu muốn giảm độ phức tạp ban đầu.**

---

## 7. Confirmation

### UI confirmation — CONFIRMED

Sau booking thành công hiển thị:

- Reservation ID.
- Date.
- Time.
- Guest count.
- Contact.
- Notes.

CTA:

- Add to Calendar.
- Manage Reservation nếu feature nằm trong release.

### Email confirmation — PROPOSED

Nên gửi email sau khi reservation được tạo/confirmed.

Email phải chứa:

- Reservation code.
- Date/time.
- Guest count.
- Restaurant contact.
- Cancellation/manage instructions nếu có.

---

## 8. Cancellation policy

Status: **OPEN**

Proposed initial rule:

- Guest có thể yêu cầu cancellation.
- Admin có thể cancel `PENDING` hoặc `CONFIRMED`.
- Self-service cancellation nếu có: cutoff đề xuất 24 giờ trước reservation.
- MVP không áp dụng fee vì payment/deposit chưa nằm trong scope.

**Không coi policy 24 giờ là quyết định cuối cùng cho đến khi business xác nhận.**

---

## 9. Deposit / payment

Status: **PROPOSED: NOT IN MVP**

- Không thu deposit/payment trong MVP.
- Reservation creation không phụ thuộc payment gateway.
- Nếu business sau này yêu cầu no-show protection, tạo decision riêng cho deposit/card guarantee.

---

## 10. Dress code

Status: **OPEN**

Source yêu cầu dress code phải dễ tìm nhưng chưa cung cấp nội dung cụ thể.

Proposed placeholder:

```text
Smart casual / refined casual
```

Placeholder không được publish production trước khi business duyệt.

---

## 11. Private Dining

Capacity baseline:

```text
Private Room: 12–20 guests
Chef's Table: 6–8 guests
Full Restaurant Buyout: up to 80 guests
```

Status: **CONFIRMED FROM SOURCE**

Event enquiry fields:

- Name.
- Email.
- Phone.
- Event date.
- Guests.
- Event type.
- Budget.
- Message.

Status: **CONFIRMED**

---

## 12. Contact

Baseline:

```text
hello@emberandoak.com
+1 212 555 0188
```

Status: **CONFIRMED FROM SOURCE**

Cần business xác nhận đây là production contact hay placeholder trước launch.

---

## 13. Data validation

Server phải validate tối thiểu:

- Date không nằm trong quá khứ.
- Time nằm trong candidate slots hợp lệ.
- Guest count trong allowed range.
- Email format.
- Phone format/length hợp lý.
- Special request max length.
- Valid state transition.
- Required operational rules.

Client validation chỉ là UX enhancement.

---

## 14. PII rules

Reservation/customer PII gồm:

- Name.
- Email.
- Phone.
- Special request nếu chứa dữ liệu cá nhân.

Rules:

- Không gửi PII vào analytics.
- Không log full PII trong application error logs.
- Admin routes phải có authorization.
- Chỉ hiển thị data cần thiết cho staff role.
- Retention policy cần được xác nhận trước production.

Status: **PROPOSED SECURITY BASELINE**

---

## 15. Open business decisions — P0 blockers

Các mục dưới đây phải được chốt trước khi hoàn tất Phase 0:

1. Production city/timezone.
2. Currency.
3. Standard reservation duration.
4. Guest min/max cho regular online reservation.
5. Booking window.
6. Same-day cutoff.
7. Cancellation policy.
8. Dress code.
9. Email confirmation có bắt buộc MVP không.
10. Availability dùng table-aware hay capacity-first.
11. Deposit/payment có thực sự không cần MVP không.
12. Contact/address hiện tại là production data hay placeholder.
