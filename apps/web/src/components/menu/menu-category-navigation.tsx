import type { MenuCategoryContent } from "@ember-and-oak/types";

import styles from "./menu.module.css";

export function MenuCategoryNavigation({
  categories,
}: Readonly<{ categories: readonly MenuCategoryContent[] }>) {
  return (
    <nav aria-label="Menu categories" className={styles.categoryNavigation}>
      <ul className={styles.menuNavigation}>
        {categories.map(({ category }) => (
          <li key={category.id}>
            <a href={`#${category.slug}`}>{category.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
