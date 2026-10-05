import type { ReservationGuest } from "./customer.js";

export const reservationStatuses = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

export type Reservation = Readonly<{
  id: string;
  reservationCode: string;
  customerId: string;
  date: string;
  startTime: string;
  guestCount: number;
  status: ReservationStatus;
  specialRequest?: string;
  internalNote?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}>;

export type ReservationSummary = Pick<
  Reservation,
  "id" | "reservationCode" | "date" | "startTime" | "guestCount" | "status" | "createdAt"
>;

export type CreateReservationInput = Readonly<{
  date: string;
  startTime: string;
  guestCount: number;
  guest: ReservationGuest;
  specialRequest?: string;
}>;

export type CreateReservationResult = Readonly<{
  reservation: ReservationSummary;
  idempotentReplay: boolean;
}>;

export type ReservationTransition = Readonly<{
  from: ReservationStatus;
  to: ReservationStatus;
}>;
