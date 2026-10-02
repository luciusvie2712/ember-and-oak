import type { MediaAsset } from "@ember-and-oak/types";

import { ResponsiveImage } from "./responsive-image";
import styles from "./media.module.css";

type EditorialMediaProps = Readonly<{
  asset: MediaAsset;
  alt?: string | undefined;
  sizes: string;
  className?: string | undefined;
  preload?: boolean | undefined;
  eager?: boolean | undefined;
  showCaption?: boolean | undefined;
}>;

export function EditorialMedia({
  asset,
  alt,
  sizes,
  className,
  preload,
  eager,
  showCaption = true,
}: EditorialMediaProps) {
  const caption = showCaption ? asset.caption : undefined;

  return (
    <figure
      className={[styles.figure, className].filter(Boolean).join(" ")}
      style={{ aspectRatio: String(asset.aspectRatio) }}
    >
      <ResponsiveImage alt={alt} asset={asset} eager={eager} preload={preload} sizes={sizes} />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
