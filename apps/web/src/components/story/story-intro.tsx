import type { StoryPage } from "@ember-and-oak/types";

import styles from "./story.module.css";

export function StoryIntro({ story }: Readonly<{ story: StoryPage }>) {
  return (
    <header className={styles.intro}>
      <p className="section-label">Ember &amp; Oak</p>
      <h1>{story.introHeading}</h1>
      {story.introBody ? <p>{story.introBody}</p> : null}
    </header>
  );
}
