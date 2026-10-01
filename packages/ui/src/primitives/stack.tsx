import type { CSSProperties, HTMLAttributes } from "react";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16";
};

export function Stack({ className = "", gap = "4", style, ...props }: StackProps) {
  return (
    <div
      className={`eo-stack ${className}`.trim()}
      style={{ "--stack-gap": `var(--space-${gap})`, ...style } as CSSProperties}
      {...props}
    />
  );
}
