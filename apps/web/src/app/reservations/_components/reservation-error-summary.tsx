type FieldError = { id: string; label: string; message: string };

export function ReservationErrorSummary({ errors }: { errors: readonly FieldError[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="reservation-error-summary" role="alert" tabIndex={-1}>
      <h2>Please check your information</h2>
      <ul>
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`}>
              {error.label}: {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
