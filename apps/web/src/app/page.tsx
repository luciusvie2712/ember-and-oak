import { AtmosphereSection } from "@/components/home/atmosphere-section";
import { ChefStorySection } from "@/components/home/chef-story-section";
import { DiningExperiencesSection } from "@/components/home/dining-experiences-section";
import { HeroSection } from "@/components/home/hero-section";
import { LocationSummarySection } from "@/components/home/location-summary-section";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { ReservationCtaSection } from "@/components/home/reservation-cta-section";
import { Reveal } from "@/components/home/reveal";
import { SignatureMenuSection } from "@/components/home/signature-menu-section";
import { getContentRepository } from "@/lib/content";
import { connection } from "next/server";

export default async function HomePage() {
  await connection();
  const repository = await getContentRepository();
  const content = await repository.getPublishedHome().catch(() => null);

  if (!content) {
    return (
      <section className="public-page">
        <p className="section-label">Ember &amp; Oak</p>
        <h1>Our dining room is preparing for service.</h1>
        <p>Please return shortly or contact the restaurant.</p>
      </section>
    );
  }

  return (
    <>
      <HeroSection home={content.home} media={content.heroMedia} />
      <Reveal>
        <PhilosophySection home={content.home} media={content.philosophyMedia} />
      </Reveal>
      <Reveal>
        <SignatureMenuSection dishes={content.featuredDishes} />
      </Reveal>
      <Reveal variant="media">
        <AtmosphereSection home={content.home} media={content.atmosphereMedia} />
      </Reveal>
      <Reveal>
        <ChefStorySection content={content.chef} />
      </Reveal>
      <Reveal>
        <DiningExperiencesSection experiences={content.experiences} />
      </Reveal>
      <Reveal>
        <ReservationCtaSection home={content.home} />
      </Reveal>
      <LocationSummarySection />
    </>
  );
}
