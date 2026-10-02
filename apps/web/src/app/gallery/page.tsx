import type { Metadata } from "next";
import { connection } from "next/server";

import { GalleryCategoryNavigation } from "@/components/gallery/gallery-category-navigation";
import { GalleryEmptyState } from "@/components/gallery/gallery-empty-state";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import styles from "@/components/gallery/gallery.module.css";
import { getContentRepository } from "@/lib/content";

export const metadata: Metadata = { title: "Gallery" };

type GalleryPageProps = Readonly<{
  searchParams: Promise<{ category?: string | string[] | undefined }>;
}>;

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  await connection();
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const repository = await getContentRepository();
  const allContent = await repository.getPublishedGallery().catch(() => ({ categories: [] }));
  const categories = categorySlug
    ? allContent.categories.filter((entry) => entry.category.slug === categorySlug)
    : allContent.categories;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="section-label">Through our lens</p>
        <h1>Gallery</h1>
        <p>A closer look at the ingredients, people, and rooms that shape each evening.</p>
      </header>
      <GalleryCategoryNavigation activeSlug={categorySlug} categories={allContent.categories} />
      {categories.some((entry) => entry.items.length > 0) ? (
        <GalleryGrid categories={categories} />
      ) : (
        <GalleryEmptyState />
      )}
    </div>
  );
}
