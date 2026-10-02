import type { Metadata } from "next";

import { PublicPageIntro } from "@/components/site/public-page-intro";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PublicPageIntro label="Visit" title="Contact">
      <p>
        Verified address, hours, phone, and email will appear from the operational content source.
      </p>
    </PublicPageIntro>
  );
}
