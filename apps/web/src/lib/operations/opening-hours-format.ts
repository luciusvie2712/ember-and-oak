import type { PublicOpeningHours } from "@ember-and-oak/types";

export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function formatOpeningTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours! >= 12 ? "PM" : "AM";
  const displayHour = hours! % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function formatOpeningHours(hours: PublicOpeningHours): string {
  if (hours.isClosed || !hours.openTime || !hours.closeTime) return "Closed";
  return `${formatOpeningTime(hours.openTime)}–${formatOpeningTime(hours.closeTime)}`;
}
