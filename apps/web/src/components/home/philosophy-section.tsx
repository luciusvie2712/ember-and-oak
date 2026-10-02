import type { HomePage, MediaAsset } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";

import styles from "./philosophy-section.module.css";

export function PhilosophySection({
  home,
  media,
}: Readonly<{ home: HomePage; media?: MediaAsset | undefined }>) {
  return (
    <section aria-labelledby="philosophy-title" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className="section-label">{home.philosophyLabel}</p>
          <h2 id="philosophy-title">{home.philosophyHeading}</h2>
          <div className={styles.body}>
            <p>{home.philosophyBody}</p>
          </div>
        </div>
        {media ? (
          <div className={styles.media}>
            <ResponsiveImage asset={media} sizes="(max-width: 767px) calc(100vw - 40px), 52vw" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
