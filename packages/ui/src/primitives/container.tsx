import type { HTMLAttributes } from "react";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "reading" | "content" | "wide" | "max";
};

export function Container({ className = "", size = "content", ...props }: ContainerProps) {
  return <div className={`eo-container eo-container--${size} ${className}`.trim()} {...props} />;
}
