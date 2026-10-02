import type { MenuDishContent } from "@ember-and-oak/types";

import { formatMenuPrice } from "@/lib/content/format-menu-price";

type SignatureMenuRowProps = Readonly<{
  entry: MenuDishContent;
  index: number;
  isActive: boolean;
  onActivate: (id: string) => void;
}>;

export function SignatureMenuRow({ entry, index, isActive, onActivate }: SignatureMenuRowProps) {
  const { dish } = entry;
  return (
    <button
      aria-pressed={isActive}
      className="signature-menu-row"
      data-active={isActive}
      onFocus={() => onActivate(dish.id)}
      onPointerEnter={() => onActivate(dish.id)}
      type="button"
    >
      <span className="signature-menu-row__index">0{index + 1}</span>
      <span className="signature-menu-row__copy">
        <strong>{dish.name}</strong>
        <span>{dish.description}</span>
      </span>
      <span className="signature-menu-row__price">
        {formatMenuPrice(dish.priceAmount, dish.currencyCode)}
      </span>
    </button>
  );
}
