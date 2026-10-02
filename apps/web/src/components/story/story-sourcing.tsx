import type { StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StorySourcing({ story }: Readonly<{ story: StoryPage }>) {
  return (
    <StorySection
      body={story.sourcingBody}
      heading={story.sourcingHeading}
      id="story-sourcing"
      label="Ingredient sourcing"
    />
  );
}
