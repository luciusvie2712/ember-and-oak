export type ReservationStep =
  | "SEARCH"
  | "SEARCHING"
  | "AVAILABILITY"
  | "GUEST_DETAILS"
  | "SUBMITTING"
  | "CONFIRMED";

export type PendingReservationRequest = {
  key: string;
  serializedBody: string;
};

export function sameLogicalRequest(
  current: PendingReservationRequest | null,
  serializedBody: string,
): boolean {
  return current !== null && current.serializedBody === serializedBody;
}
