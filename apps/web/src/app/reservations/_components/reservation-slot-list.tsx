import type { AvailabilitySlot } from "@ember-and-oak/types";

import { formatReservationTime } from "../_lib/reservation-format";

type Props = {
  slots: readonly AvailabilitySlot[];
  selected: string | null;
  onSelect: (startTime: string) => void;
  disabled?: boolean;
};

export function ReservationSlotList({ slots, selected, onSelect, disabled = false }: Props) {
  return (
    <fieldset className="reservation-slot-fieldset" disabled={disabled}>
      <legend>Available times</legend>
      <p>Choose one time to continue.</p>
      <div className="reservation-slots">
        {slots.map((slot) => (
          <label className="reservation-slot" key={slot.startTime}>
            <input
              type="radio"
              name="reservation-slot"
              value={slot.startTime}
              checked={selected === slot.startTime}
              disabled={!slot.available || disabled}
              onChange={() => onSelect(slot.startTime)}
            />
            <span>{formatReservationTime(slot.startTime)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
