export class PrivateEventDomainError extends Error {
  constructor(
    readonly code:
      | 'VALIDATION_ERROR'
      | 'IDEMPOTENCY_CONFLICT'
      | 'INTERNAL_ERROR',
    message: string,
  ) {
    super(message);
    this.name = 'PrivateEventDomainError';
  }
}
