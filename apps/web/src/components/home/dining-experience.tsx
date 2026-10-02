import Link from "next/link";
import type { DiningExperienceContent } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";

type DiningExperienceProps = Readonly<{
  content: DiningExperienceContent;
  index: number;
}>;

export function DiningExperience({ content, index }: DiningExperienceProps) {
  const { experience, media } = content;
  return (
    <article className="dining-experience" data-reverse={index % 2 === 1}>
      <div className="dining-experience__media">
        <ResponsiveImage asset={media} sizes="(max-width: 767px) calc(100vw - 40px), 52vw" />
      </div>
      <div className="dining-experience__copy">
        <p className="section-label">0{index + 1}</p>
        <h3>{experience.title}</h3>
        <p>{experience.description}</p>
        {experience.ctaTarget && experience.ctaLabel ? (
          <Link className="directional-link" href={experience.ctaTarget}>
            {experience.ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
