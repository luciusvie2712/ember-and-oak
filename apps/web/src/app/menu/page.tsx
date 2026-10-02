import type { Metadata } from "next";
import { connection } from "next/server";

import { MenuCategoryNavigation } from "@/components/menu/menu-category-navigation";
import { MenuCategorySection } from "@/components/menu/menu-category-section";
import { MenuHero } from "@/components/menu/menu-hero";
import { MenuReservationCta } from "@/components/menu/menu-reservation-cta";
import styles from "@/components/menu/menu.module.css";
import { getContentRepository } from "@/lib/content";

export const metadata: Metadata = { title: "Menu" };

export default async function MenuPage() {
  await connection();
  const repository = await getContentRepository();
  const content = await repository.getPublishedMenu("dinner").catch(() => null);

  if (!content) {
    return (
      <div className={styles.empty}>
        <p className="section-label">Menu</p>
        <h1>Our current menu is temporarily unavailable.</h1>
        <p>Please contact the restaurant for today’s offering.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <MenuHero menu={content.menu} />
      <MenuCategoryNavigation categories={content.categories} />
      {content.categories.map((category) => (
        <MenuCategorySection entry={category} key={category.category.id} />
      ))}
      <MenuReservationCta />
    </div>
  );
}
