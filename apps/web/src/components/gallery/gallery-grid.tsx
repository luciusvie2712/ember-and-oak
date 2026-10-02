import type { GalleryCategoryContent } from "@ember-and-oak/types";

import { GalleryItem } from "./gallery-item";
import styles from "./gallery.module.css";

export function GalleryGrid({
  categories,
}: Readonly<{ categories: readonly GalleryCategoryContent[] }>) {
  const items = categories.flatMap((entry) => entry.items);

  return (
    <div className={styles.grid}>
      {items.map((entry) => (
        <GalleryItem entry={entry} key={entry.item.id} />
      ))}
    </div>
  );
}
