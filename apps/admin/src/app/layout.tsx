import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@ember-and-oak/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ember & Oak Admin",
  description: "Administrative application foundation for Ember & Oak.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
