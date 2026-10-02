import type { Metadata } from "next";

import { PublicPageIntro } from "@/components/site/public-page-intro";

export const metadata: Metadata = { title: "Private Dining" };

export default function PrivateDiningPage() {
  return (
    <PublicPageIntro label="Gather together" title="Private Dining">
      <p>Private dining details will follow the approved experience and capacity records.</p>
    </PublicPageIntro>
  );
}
