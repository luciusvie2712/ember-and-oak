import type { ChefProfileContent } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";
import styles from "./chef-story-section.module.css";

type ChefStorySectionProps = Readonly<{ content: ChefProfileContent }>;

export function ChefStorySection({ content }: ChefStorySectionProps) {
  const { chef, portrait } = content;
  return (
    <section aria-labelledby="chef-story-title" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.media}>
          <ResponsiveImage asset={portrait} sizes="(max-width: 767px) calc(100vw - 40px), 48vw" />
        </div>
        <div className={styles.copy}>
          <p className="section-label">{chef.title}</p>
          <h2 id="chef-story-title">{chef.name}</h2>
          <p>{chef.shortBio}</p>
          {chef.quote ? <blockquote>“{chef.quote}”</blockquote> : null}
        </div>
      </div>
    </section>
  );
}
