import type { PublicOpeningHours } from "@ember-and-oak/types";

import { formatOpeningHours, weekdayNames } from "@/lib/operations/opening-hours-format";

export function OpeningHours({ hours }: Readonly<{ hours: readonly PublicOpeningHours[] }>) {
  return (
    <dl className="operational-hours">
      {[...hours]
        .sort((left, right) => left.dayOfWeek - right.dayOfWeek)
        .map((entry) => (
          <div key={entry.dayOfWeek}>
            <dt>{weekdayNames[entry.dayOfWeek]}</dt>
            <dd>{formatOpeningHours(entry)}</dd>
          </div>
        ))}
    </dl>
  );
}
