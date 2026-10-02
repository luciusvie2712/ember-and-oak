import type { MediaAsset, StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StoryOrigin({
  story,
  media,
}: Readonly<{ story: StoryPage; media?: MediaAsset | undefined }>) {
  return (
    <StorySection
      body={story.originBody}
      heading={story.originHeading}
      id="story-origin"
      label="Origin"
      media={media}
    />
  );
}
