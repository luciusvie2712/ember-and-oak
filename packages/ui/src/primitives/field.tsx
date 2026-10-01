import type { InputHTMLAttributes, ReactNode } from "react";

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: ReactNode;
};

export function Field({ error, id, label, ...props }: FieldProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <label className="eo-field" htmlFor={id}>
      <span className="eo-field__label">{label}</span>
      <input aria-describedby={errorId} aria-invalid={Boolean(error)} id={id} {...props} />
      {error ? (
        <span className="eo-field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
