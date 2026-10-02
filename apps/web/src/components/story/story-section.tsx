import type { ReactNode } from "react";
import type { MediaAsset } from "@ember-and-oak/types";

import { EditorialMedia } from "@/components/media/editorial-media";

import styles from "./story.module.css";

type StorySectionProps = Readonly<{
  id: string;
  label: string;
  heading: string;
  body: string;
  media?: MediaAsset | undefined;
  reverse?: boolean | undefined;
  children?: ReactNode;
}>;

export function StorySection({
  id,
  label,
  heading,
  body,
  media,
  reverse,
  children,
}: StorySectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className={styles.section} data-reverse={reverse}>
      {media ? (
        <EditorialMedia
          asset={media}
          className={styles.media}
          sizes="(max-width: 767px) calc(100vw - 40px), 48vw"
        />
      ) : null}
      <div className={styles.copy}>
        <p className="section-label">{label}</p>
        <h2 id={`${id}-title`}>{heading}</h2>
        <p>{body}</p>
        {children}
      </div>
    </section>
  );
}
