import type { StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StoryFounders({ story }: Readonly<{ story: StoryPage }>) {
  if (!story.foundersHeading || !story.foundersBody) return null;
  return (
    <StorySection
      body={story.foundersBody}
      heading={story.foundersHeading}
      id="story-founders"
      label="Founders"
      reverse
    />
  );
}
