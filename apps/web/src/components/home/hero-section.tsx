import Link from "next/link";
import type { HomePage, MediaAsset } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";
import { reservationHref } from "@/config/navigation";

import styles from "./hero-section.module.css";

export function HeroSection({ home, media }: Readonly<{ home: HomePage; media: MediaAsset }>) {
  return (
    <section aria-labelledby="home-title" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className="section-label">{home.heroEyebrow ?? "Ember & Oak"}</p>
          <h1 id="home-title">{home.heroHeading}</h1>
          <p className={styles.intro}>{home.heroDescription}</p>
          <div className={styles.actions}>
            <Link className="button-link button-link--secondary" href="/menu">
              View Menu
            </Link>
            <Link className="button-link button-link--primary" href={reservationHref}>
              Reserve a Table
            </Link>
          </div>
        </div>

        <div className={styles.media}>
          <ResponsiveImage
            asset={media}
            preload
            sizes="(max-width: 767px) calc(100vw - 40px), 50vw"
          />
          <p className={styles.caption}>Fire, season, restraint.</p>
        </div>
      </div>
    </section>
  );
}
