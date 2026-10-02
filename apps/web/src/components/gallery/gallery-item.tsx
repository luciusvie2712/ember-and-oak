import type { GalleryItemContent } from "@ember-and-oak/types";

import { EditorialMedia } from "@/components/media/editorial-media";

import styles from "./gallery.module.css";

export function GalleryItem({ entry }: Readonly<{ entry: GalleryItemContent }>) {
  return (
    <article className={styles.item}>
      <EditorialMedia
        alt={entry.item.altText}
        asset={entry.media}
        className={styles.itemMedia}
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 30vw"
        showCaption={false}
      />
      {entry.item.caption ? <p>{entry.item.caption}</p> : null}
    </article>
  );
}
