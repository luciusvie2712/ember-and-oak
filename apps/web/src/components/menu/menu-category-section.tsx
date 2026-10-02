import type { MenuCategoryContent } from "@ember-and-oak/types";

import { DishRow } from "./dish-row";
import styles from "./menu.module.css";

export function MenuCategorySection({ entry }: Readonly<{ entry: MenuCategoryContent }>) {
  return (
    <section
      aria-labelledby={`${entry.category.slug}-title`}
      className={styles.category}
      id={entry.category.slug}
    >
      <header>
        <p className="section-label">{String(entry.category.displayOrder + 1).padStart(2, "0")}</p>
        <h2 id={`${entry.category.slug}-title`}>{entry.category.name}</h2>
        {entry.category.description ? <p>{entry.category.description}</p> : null}
      </header>
      <div className={styles.dishes}>
        {entry.dishes.map((dish) => (
          <DishRow entry={dish} key={dish.dish.id} />
        ))}
      </div>
    </section>
  );
}
