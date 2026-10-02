import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@ember-and-oak/ui/styles.css";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileReserveCta } from "@/components/site/mobile-reserve-cta";

import { displayFont, uiFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ember & Oak",
    template: "%s | Ember & Oak",
  },
  description: "Contemporary seasonal dining inspired by local ingredients and open-fire cooking.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${displayFont.variable} ${uiFont.variable}`} lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <div className="site-shell">
          <SiteHeader />

          <main id="main-content">{children}</main>

          <SiteFooter />
          <MobileReserveCta />
        </div>
      </body>
    </html>
  );
}
