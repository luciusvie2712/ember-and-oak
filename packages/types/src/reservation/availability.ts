export type AvailabilityStatus = "AVAILABLE" | "CLOSED" | "SPECIAL_CLOSURE" | "NO_AVAILABILITY";

export type AvailabilityQuery = Readonly<{
  date: string;
  guestCount: number;
}>;

export type AvailabilitySlot = Readonly<{
  startTime: string;
  endTime: string;
  available: boolean;
  remainingCapacity?: number;
}>;

export type AvailabilityResult = Readonly<{
  date: string;
  guestCount: number;
  timezone: string;
  status: AvailabilityStatus;
  slots: readonly AvailabilitySlot[];
}>;
