import type { MediaAsset, StoryPage } from "@ember-and-oak/types";

import { StorySection } from "./story-section";

export function StoryDesign({
  story,
  media,
}: Readonly<{ story: StoryPage; media?: MediaAsset | undefined }>) {
  return (
    <StorySection
      body={story.designBody}
      heading={story.designHeading}
      id="story-design"
      label="Restaurant design"
      media={media}
    />
  );
}
