import type { ReservationStatus } from "../reservation/reservation.js";
import type { ReservationGuest } from "../reservation/customer.js";

export type ReservationStatusEvent = Readonly<{
  id: string;
  fromStatus: ReservationStatus;
  toStatus: ReservationStatus;
  reason?: string;
  actorDisplayName: string;
  createdAt: string;
}>;

export type AdminReservationListQuery = Readonly<{
  date?: string;
  status?: ReservationStatus;
  q?: string;
  guestCount?: number;
  cursor?: string;
  limit?: number;
}>;

export type AdminReservationListItem = Readonly<{
  id: string;
  reservationCode: string;
  date: string;
  startTime: string;
  guestCount: number;
  status: ReservationStatus;
  guestName: string;
  createdAt: string;
}>;

export type AdminReservationDetail = AdminReservationListItem &
  Readonly<{
    guest: ReservationGuest;
    specialRequest?: string;
    internalNote?: string;
    updatedAt: string;
    cancelledAt?: string;
    statusHistory: readonly ReservationStatusEvent[];
    assignedTables: readonly { id: string; name: string; capacity: number }[];
  }>;

export type AdminReservationTransitionInput = Readonly<{
  toStatus: ReservationStatus;
  expectedStatus: ReservationStatus;
  reason?: string | null;
}>;
