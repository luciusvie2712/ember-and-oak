import type { Menu } from "@ember-and-oak/types";

import styles from "./menu.module.css";

export function MenuHero({ menu }: Readonly<{ menu: Menu }>) {
  return (
    <header className={styles.hero}>
      <p className="section-label">{menu.seasonLabel ?? "Season-led cooking"}</p>
      <h1>{menu.name}</h1>
      {menu.description ? <p>{menu.description}</p> : null}
    </header>
  );
}
