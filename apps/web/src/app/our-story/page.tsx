import type { Metadata } from "next";
import { connection } from "next/server";

import { StoryChef } from "@/components/story/story-chef";
import { StoryDesign } from "@/components/story/story-design";
import { StoryFounders } from "@/components/story/story-founders";
import { StoryIntro } from "@/components/story/story-intro";
import { StoryOrigin } from "@/components/story/story-origin";
import { StoryPhilosophy } from "@/components/story/story-philosophy";
import { StoryReservationCta } from "@/components/story/story-reservation-cta";
import { StorySourcing } from "@/components/story/story-sourcing";
import { StorySustainability } from "@/components/story/story-sustainability";
import styles from "@/components/story/story.module.css";
import { getContentRepository } from "@/lib/content";

export const metadata: Metadata = { title: "Our Story" };

export default async function OurStoryPage() {
  await connection();
  const repository = await getContentRepository();
  const content = await repository.getPublishedStory("our-story").catch(() => null);

  if (!content) {
    return (
      <div className={styles.empty}>
        <p className="section-label">Our Story</p>
        <h1>Our story is temporarily unavailable.</h1>
      </div>
    );
  }

  const mediaFor = (sectionKey: string) =>
    content.sectionMedia.find((entry) => entry.relation.sectionKey === sectionKey)?.media;

  return (
    <div className={styles.page}>
      <StoryIntro story={content.story} />
      <StoryOrigin media={mediaFor("ORIGIN")} story={content.story} />
      <StoryFounders story={content.story} />
      <StoryChef content={content.chef} />
      <StoryPhilosophy story={content.story} />
      <StorySourcing story={content.story} />
      <StorySustainability story={content.story} />
      <StoryDesign media={mediaFor("DESIGN")} story={content.story} />
      <StoryReservationCta />
    </div>
  );
}
