import type { Metadata } from "next";
import { connection } from "next/server";

import { ResponsiveImage } from "@/components/media/responsive-image";
import { getContentRepository } from "@/lib/content";

import { PrivateEventEnquiryForm } from "./_components/private-event-enquiry-form";

import "./private-dining.css";

export const metadata: Metadata = { title: "Private Dining" };

export default async function PrivateDiningPage() {
  await connection();
  const repository = await getContentRepository();
  const content = await repository.getPublishedPrivateDining().catch(() => null);

  if (!content) {
    return (
      <section className="public-page">
        <p className="section-label">Private Dining</p>
        <h1>Something special is taking shape.</h1>
        <p>Please return soon for our private dining experiences.</p>
      </section>
    );
  }

  return (
    <div className="private-dining-page">
      <section className="private-dining-hero" aria-labelledby="private-dining-title">
        <div className="private-dining-hero__copy">
          <p className="section-label">Gather together</p>
          <h1 id="private-dining-title">{content.page.heroHeading}</h1>
          <p>{content.page.heroDescription}</p>
          <a className="button-link button-link--primary" href="#plan-your-event">
            Plan Your Event
          </a>
        </div>
        <div className="private-dining-hero__media">
          <ResponsiveImage
            asset={content.heroMedia}
            preload
            sizes="(max-width: 767px) 100vw, 56vw"
          />
        </div>
      </section>

      {content.page.introBody ? (
        <section className="private-dining-intro" aria-label="Private dining introduction">
          <p>{content.page.introBody}</p>
        </section>
      ) : null}

      <section
        className="private-dining-experiences"
        aria-labelledby="private-dining-experiences-title"
      >
        <div className="private-dining-experiences__heading">
          <p className="section-label">The possibilities</p>
          <h2 id="private-dining-experiences-title">A room for every occasion.</h2>
        </div>
        {content.experiences.map(({ experience, media }, index) => (
          <article
            className="private-dining-experience"
            data-reverse={index % 2 === 1}
            key={experience.id}
          >
            <div className="private-dining-experience__media">
              <ResponsiveImage asset={media} sizes="(max-width: 767px) 100vw, 55vw" />
            </div>
            <div className="private-dining-experience__copy">
              <p className="section-label">0{index + 1} / Private Dining</p>
              <h3>{experience.name}</h3>
              <p className="private-dining-experience__capacity">{experience.capacityLabel}</p>
              <p>{experience.description}</p>
              <a className="directional-link" href="#plan-your-event">
                Enquire about this space <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </section>

      <section
        className="private-dining-enquiry"
        id="plan-your-event"
        aria-labelledby="enquiry-title"
      >
        <div className="private-dining-enquiry__intro">
          <p className="section-label">Begin a conversation</p>
          <h2 id="enquiry-title">{content.page.enquiryHeading}</h2>
          {content.page.enquiryBody ? <p>{content.page.enquiryBody}</p> : null}
        </div>
        <PrivateEventEnquiryForm />
      </section>
    </div>
  );
}
