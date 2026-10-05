import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ReservationSlotList } from "./reservation-slot-list";

describe("reservation slots", () => {
  it("uses native radio semantics with explicit checked and disabled state", () => {
    const markup = renderToStaticMarkup(
      <ReservationSlotList
        slots={[
          { startTime: "19:00", endTime: "21:00", available: true },
          { startTime: "19:30", endTime: "21:30", available: false },
        ]}
        selected="19:00"
        onSelect={() => undefined}
      />,
    );
    expect(markup).toContain('type="radio"');
    expect(markup).toContain('checked=""');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain("7:00 PM");
  });
});
