export type OpeningHours = Readonly<{
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
}>;

export type SpecialClosureType = "FULL_DAY" | "PARTIAL_DAY";

export type SpecialClosure = Readonly<{
  id: string;
  date: string;
  type: SpecialClosureType;
  /** Internal operational reason; never use as guest-facing copy. */
  reason: string;
  startTime?: string;
  endTime?: string;
  publicMessage?: string;
}>;
