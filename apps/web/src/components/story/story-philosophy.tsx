import type { StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StoryPhilosophy({ story }: Readonly<{ story: StoryPage }>) {
  return (
    <StorySection
      body={story.philosophyBody}
      heading={story.philosophyHeading}
      id="story-philosophy"
      label="Philosophy"
      reverse
    />
  );
}
