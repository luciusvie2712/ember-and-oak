import Image from "next/image";

import type { MediaAsset } from "@ember-and-oak/types";

type ResponsiveImageProps = Readonly<{
  asset: MediaAsset;
  alt?: string | undefined;
  sizes: string;
  className?: string | undefined;
  preload?: boolean | undefined;
  eager?: boolean | undefined;
  fit?: "cover" | "contain" | undefined;
}>;

export function ResponsiveImage({
  asset,
  alt,
  sizes,
  className,
  preload = false,
  eager = false,
  fit = "cover",
}: ResponsiveImageProps) {
  return (
    <Image
      alt={asset.isDecorative ? "" : (alt ?? asset.altText ?? "")}
      className={className}
      height={asset.height}
      loading={preload ? undefined : eager ? "eager" : "lazy"}
      preload={preload}
      sizes={sizes}
      src={asset.sourceUrl}
      style={{
        height: "100%",
        objectFit: fit,
        objectPosition: `${(asset.focalPointX ?? 0.5) * 100}% ${(asset.focalPointY ?? 0.5) * 100}%`,
        width: "100%",
      }}
      width={asset.width}
    />
  );
}
