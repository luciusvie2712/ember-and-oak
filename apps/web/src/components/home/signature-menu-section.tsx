"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuDishContent } from "@ember-and-oak/types";

import { ResponsiveImage } from "@/components/media/responsive-image";
import { SignatureMenuRow } from "./signature-menu-row";
import styles from "./signature-menu-section.module.css";

type SignatureMenuSectionProps = Readonly<{ dishes: readonly MenuDishContent[] }>;

export function SignatureMenuSection({ dishes }: SignatureMenuSectionProps) {
  const [activeId, setActiveId] = useState(dishes[0]?.dish.id ?? "");
  const activeDish = dishes.find((entry) => entry.dish.id === activeId) ?? dishes[0];

  if (!activeDish) return null;

  return (
    <section aria-labelledby="signature-menu-title" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.menu}>
          <p className="section-label">Signature menu</p>
          <h2 className="visually-hidden" id="signature-menu-title">
            A preview of our signature menu
          </h2>
          <div className={styles.rows}>
            {dishes.map((entry, index) => (
              <SignatureMenuRow
                entry={entry}
                index={index}
                isActive={entry.dish.id === activeDish.dish.id}
                key={entry.dish.id}
                onActivate={setActiveId}
              />
            ))}
          </div>
          <Link className="directional-link" href="/menu">
            Explore full menu <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.featured}>
          {dishes.map((entry) =>
            entry.primaryMedia ? (
              <ResponsiveImage
                asset={entry.primaryMedia}
                className={entry.dish.id === activeDish.dish.id ? styles.activeImage : styles.image}
                key={entry.dish.id}
                sizes="(max-width: 767px) calc(100vw - 40px), 34vw"
              />
            ) : null,
          )}
          <span className={styles.imageLabel}>Featured selection</span>
        </div>
      </div>
    </section>
  );
}
