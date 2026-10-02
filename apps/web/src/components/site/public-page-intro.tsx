import type { ReactNode } from "react";

type PublicPageIntroProps = Readonly<{
  label: string;
  title: string;
  children: ReactNode;
}>;

export function PublicPageIntro({ children, label, title }: PublicPageIntroProps) {
  return (
    <section className="public-page">
      <p className="section-label">{label}</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
