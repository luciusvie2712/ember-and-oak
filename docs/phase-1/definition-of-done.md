# EMBER & OAK — DEFINITION OF DONE

## Global

Một ticket chỉ `DONE` khi:

- [ ] Acceptance criteria pass.
- [ ] Code review pass.
- [ ] Lint pass.
- [ ] Typecheck pass.
- [ ] Relevant tests pass.
- [ ] Không có console/runtime error mới.
- [ ] Documentation cập nhật nếu rule/contract thay đổi.
- [ ] Staging verification hoàn thành.

## Frontend

- [ ] Responsive desktop/tablet/mobile.
- [ ] Loading/error/empty states hoàn chỉnh.
- [ ] Keyboard interaction hoạt động.
- [ ] Focus state rõ.
- [ ] Reduced-motion behavior đúng nếu có animation.
- [ ] Không gây layout shift nghiêm trọng.
- [ ] Images có dimensions/alt/loading strategy phù hợp.

## Backend/API

- [ ] Server-side validation.
- [ ] Auth/authz đúng.
- [ ] Error response nhất quán.
- [ ] Transaction được dùng khi cần.
- [ ] Critical mutation có idempotency/concurrency protection nếu applicable.
- [ ] Không log secrets/PII ngoài policy.
- [ ] Unit/integration tests cho critical logic.

## Reservation-specific

- [ ] Availability và booking dùng cùng business rules.
- [ ] Server revalidate slot khi submit.
- [ ] Invalid state transition bị reject.
- [ ] Duplicate submit không tạo duplicate booking.
- [ ] Failure không để lại partial/inconsistent reservation.
- [ ] Confirmation chỉ xuất hiện sau successful commit.

## Content/Admin

- [ ] Staff có thể thực hiện task mà không truy cập DB trực tiếp.
- [ ] Validation admin không bypass domain rules.
- [ ] Public content phản ánh thay đổi theo expected cache/publish behavior.

## Security

- [ ] Không commit secret.
- [ ] Protected route thực sự protected.
- [ ] User input được validate/escaped.
- [ ] Sensitive data không xuất hiện trong analytics.

## Product quality

- [ ] Giữ đúng editorial direction.
- [ ] Không thêm card-grid/SaaS pattern trái scope.
- [ ] Reserve CTA accessibility không bị giảm.
