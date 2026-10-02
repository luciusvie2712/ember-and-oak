import type { ChefProfileContent } from "@ember-and-oak/types";

import { StorySection } from "./story-section";
import styles from "./story.module.css";

export function StoryChef({ content }: Readonly<{ content: ChefProfileContent }>) {
  return (
    <StorySection
      body={content.chef.fullBio ?? content.chef.shortBio}
      heading={content.chef.name}
      id="story-chef"
      label={content.chef.title}
      media={content.portrait}
    >
      {content.chef.quote ? (
        <blockquote className={styles.quote}>“{content.chef.quote}”</blockquote>
      ) : null}
    </StorySection>
  );
}
