import Link from "next/link";
import type { GalleryCategoryContent } from "@ember-and-oak/types";

import styles from "./gallery.module.css";

export function GalleryCategoryNavigation({
  categories,
  activeSlug,
}: Readonly<{
  categories: readonly GalleryCategoryContent[];
  activeSlug?: string | undefined;
}>) {
  return (
    <nav aria-label="Gallery categories" className={styles.navigation}>
      <Link aria-current={!activeSlug ? "page" : undefined} href="/gallery">
        All
      </Link>
      {categories.map(({ category }) => (
        <Link
          aria-current={activeSlug === category.slug ? "page" : undefined}
          href={`/gallery?category=${encodeURIComponent(category.slug)}`}
          key={category.id}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
