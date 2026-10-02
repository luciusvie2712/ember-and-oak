import type { HomePage, MediaAsset } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";

import styles from "./atmosphere-section.module.css";

export function AtmosphereSection({
  home,
  media,
}: Readonly<{ home: HomePage; media: MediaAsset }>) {
  return (
    <section aria-labelledby="atmosphere-title" className={styles.section}>
      <ResponsiveImage asset={media} sizes="100vw" />
      <div className={styles.overlay} />
      <div className={styles.copy}>
        <p className="section-label">The evening</p>
        <h2 id="atmosphere-title">{home.atmosphereHeading}</h2>
        {home.atmosphereBody ? <p>{home.atmosphereBody}</p> : null}
      </div>
    </section>
  );
}
