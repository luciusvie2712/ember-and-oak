import styles from "./gallery.module.css";

export function GalleryEmptyState() {
  return (
    <div className={styles.empty}>
      <h2>No published images in this collection yet.</h2>
      <p>Explore another category or return soon.</p>
    </div>
  );
}
