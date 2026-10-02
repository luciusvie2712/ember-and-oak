import type { DiningExperienceContent } from "@ember-and-oak/types";
import { DiningExperience } from "./dining-experience";
import styles from "./dining-experiences-section.module.css";

type DiningExperiencesSectionProps = Readonly<{
  experiences: readonly DiningExperienceContent[];
}>;

export function DiningExperiencesSection({ experiences }: DiningExperiencesSectionProps) {
  return (
    <section aria-labelledby="experiences-title" className={styles.section}>
      <div className={styles.heading}>
        <p className="section-label">Dining experiences</p>
        <h2 id="experiences-title">Choose your evening.</h2>
      </div>
      <div className={styles.chapters}>
        {experiences.map((content, index) => (
          <DiningExperience content={content} index={index} key={content.experience.id} />
        ))}
      </div>
    </section>
  );
}
