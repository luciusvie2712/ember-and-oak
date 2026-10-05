import type { ReservationStep } from "../_lib/reservation-flow-state";

const stages = ["Search", "Select a time", "Guest information", "Confirmation"] as const;

function currentStage(step: ReservationStep): number {
  if (step === "CONFIRMED") return 3;
  if (step === "SUBMITTING" || step === "GUEST_DETAILS") return 2;
  if (step === "AVAILABILITY") return 1;
  return 0;
}

export function ReservationProgress({ step }: { step: ReservationStep }) {
  const current = currentStage(step);
  return (
    <nav className="reservation-progress" aria-label="Reservation progress">
      <ol>
        {stages.map((stage, index) => (
          <li key={stage} aria-current={index === current ? "step" : undefined}>
            <span>{index + 1}</span> {stage}
          </li>
        ))}
      </ol>
    </nav>
  );
}
