import { formatReservationDate, formatReservationTime } from "../_lib/reservation-format";

type Props = { date: string; guestCount: number; startTime: string | null };

export function ReservationSummary({ date, guestCount, startTime }: Props) {
  return (
    <aside className="reservation-summary" aria-label="Booking summary">
      <h2>Your reservation</h2>
      <dl>
        <div>
          <dt>Date</dt>
          <dd>{date ? formatReservationDate(date) : "Choose a date"}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{guestCount}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{startTime ? formatReservationTime(startTime) : "Choose a time"}</dd>
        </div>
      </dl>
    </aside>
  );
}
