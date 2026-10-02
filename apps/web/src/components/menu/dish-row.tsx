import type { MenuDishContent } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";
import { formatMenuPrice } from "@/lib/content/format-menu-price";

import styles from "./menu.module.css";

export function DishRow({ entry }: Readonly<{ entry: MenuDishContent }>) {
  const { dish, primaryMedia } = entry;

  return (
    <article className={styles.dish} data-available={dish.isAvailable}>
      <div className={styles.dishCopy}>
        <div className={styles.dishHeading}>
          <h3>{dish.name}</h3>
          <span>{formatMenuPrice(dish.priceAmount, dish.currencyCode)}</span>
        </div>
        <p>{dish.description}</p>
        <div className={styles.states}>
          {dish.seasonalStatus !== "CORE" ? (
            <span>{dish.seasonalStatus === "LIMITED" ? "Limited" : "Seasonal"}</span>
          ) : null}
          {!dish.isAvailable ? <span>Temporarily unavailable</span> : null}
        </div>
      </div>
      {primaryMedia ? (
        <div className={styles.dishMedia} style={{ aspectRatio: String(primaryMedia.aspectRatio) }}>
          <ResponsiveImage asset={primaryMedia} sizes="(max-width: 767px) 28vw, 10rem" />
        </div>
      ) : null}
    </article>
  );
}
