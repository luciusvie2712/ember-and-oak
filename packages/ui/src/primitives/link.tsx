import type { AnchorHTMLAttributes } from "react";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "default" | "quiet";
};

export function Link({ className = "", variant = "default", ...props }: LinkProps) {
  return <a className={`eo-link eo-link--${variant} ${className}`.trim()} {...props} />;
}
