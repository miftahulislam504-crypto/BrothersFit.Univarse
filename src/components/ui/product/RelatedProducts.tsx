"use client";

import { PedestalProduct } from "@/lib/placeholderProducts";

interface RelatedProductsProps {
  products: { key: string; product: PedestalProduct }[];
  zoneColor: string;
  onSelect: (pedestalKey: string) => void;
}

export default function RelatedProducts({
  products,
  zoneColor,
  onSelect,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-white/8 pt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
        Related Products
      </p>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {products.map(({ key, product }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="glass-panel flex w-28 shrink-0 flex-col gap-1 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
          >
            <div
              className="flex h-14 w-full items-center justify-center rounded-lg"
              style={{ backgroundColor: `${zoneColor}15` }}
            >
              <span
                className="h-5 w-5 rotate-45 rounded-sm"
                style={{ backgroundColor: zoneColor, opacity: 0.7 }}
              />
            </div>
            <p className="truncate font-display text-[11px] font-semibold text-bone">
              {product.name}
            </p>
            <p className="font-mono text-[10px] text-ember">৳{product.price}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
