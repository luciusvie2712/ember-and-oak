export type LogicalEnquiryAttempt = Readonly<{ payload: string; key: string }>;

export function keyForEnquiry(
  previous: LogicalEnquiryAttempt | null,
  payload: string,
  generate: () => string = () => crypto.randomUUID(),
): LogicalEnquiryAttempt {
  return previous?.payload === payload ? previous : { payload, key: generate() };
}
