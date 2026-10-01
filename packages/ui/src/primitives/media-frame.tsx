import type { HTMLAttributes } from "react";

export function MediaFrame({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`eo-media-frame ${className}`.trim()} {...props} />;
}
