# EMBER & OAK — DEFINITION OF READY

Một ticket chỉ được đưa vào implementation khi các điều kiện applicable dưới đây đạt.

## Required for every ticket

- [ ] Business outcome rõ.
- [ ] User/system actor rõ.
- [ ] Requirement không mơ hồ.
- [ ] Acceptance criteria có thể test.
- [ ] Priority đã xác định.
- [ ] Epic đã xác định.
- [ ] Dependency đã ghi.
- [ ] Không phụ thuộc một business decision đang `OPEN`, hoặc ticket được đánh dấu blocked.

## UI ticket

- [ ] Screen/section/state đã xác định.
- [ ] Desktop behavior rõ.
- [ ] Mobile behavior rõ.
- [ ] Loading state nếu cần.
- [ ] Empty state nếu cần.
- [ ] Error state nếu cần.
- [ ] Hover/focus/active behavior nếu cần.
- [ ] Accessibility notes có.
- [ ] Asset/content dependency có.

## API/backend ticket

- [ ] Input/output contract rõ.
- [ ] Validation rules rõ.
- [ ] Auth/authz requirement rõ.
- [ ] Error cases rõ.
- [ ] Transaction/concurrency requirement rõ nếu mutation.
- [ ] Migration/data impact đã xác định.
- [ ] Logging/observability requirement có nếu critical flow.

## Reservation ticket

- [ ] Business rule reference có.
- [ ] Timezone handling rõ.
- [ ] Status transition rõ nếu thay đổi state.
- [ ] Availability impact rõ.
- [ ] Concurrency behavior rõ nếu create/update booking.
- [ ] PII handling rõ.

## Content ticket

- [ ] Content owner.
- [ ] Data source.
- [ ] Placeholder policy.
- [ ] Publish state.
- [ ] SEO implication nếu public/indexable.

## Ready states

```text
READY
BLOCKED_BY_DECISION
BLOCKED_BY_DESIGN
BLOCKED_BY_TECH
```

`BLOCKED_*` không được đưa vào active implementation sprint.
