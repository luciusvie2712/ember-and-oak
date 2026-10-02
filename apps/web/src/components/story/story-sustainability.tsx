import type { StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StorySustainability({ story }: Readonly<{ story: StoryPage }>) {
  return (
    <StorySection
      body={story.sustainabilityBody}
      heading={story.sustainabilityHeading}
      id="story-sustainability"
      label="Sustainability"
      reverse
    />
  );
}
