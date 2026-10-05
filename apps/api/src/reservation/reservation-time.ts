import { reservationConfig } from './reservation-config.js';

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number);
  return hours! * 60 + minutes!;
}

export function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutes(value: string, amount: number): string {
  return minutesToTime(timeToMinutes(value) + amount);
}

export function intervalsOverlap(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
): boolean {
  return (
    timeToMinutes(leftStart) < timeToMinutes(rightEnd) &&
    timeToMinutes(rightStart) < timeToMinutes(leftEnd)
  );
}

export function dayOfWeek(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function addCalendarDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function restaurantLocalDate(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: reservationConfig.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function restaurantLocalDateTimeEpoch(
  date: string,
  time: string,
): number {
  // Vietnam has used UTC+07:00 without daylight-saving changes since 1975.
  return Date.parse(`${date}T${time}:00+07:00`);
}

export function generateCandidateSlots(
  openTime: string,
  closeTime: string,
): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = [];
  const close = timeToMinutes(closeTime);
  for (
    let start = timeToMinutes(openTime);
    start +
      reservationConfig.durationMinutes +
      reservationConfig.turnBufferMinutes <=
    close;
    start += reservationConfig.slotIntervalMinutes
  ) {
    slots.push({
      startTime: minutesToTime(start),
      endTime: minutesToTime(start + reservationConfig.durationMinutes),
    });
  }
  return slots;
}
