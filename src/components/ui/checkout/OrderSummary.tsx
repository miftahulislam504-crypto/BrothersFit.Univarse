"use client";

import { CartItem } from "@/store/useUniverseStore";

interface OrderSummaryProps {
  items: CartItem[];
  compact?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_FEE = 80;

export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

export default function OrderSummary({ items, compact = false }: OrderSummaryProps) {
  const { subtotal, shipping, total } = calculateOrderTotals(items);

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
        Order Summary
      </p>

      {!compact && (
        <div className="flex max-h-52 flex-col gap-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.zoneColor}15` }}
              >
                <span
                  className="h-4 w-4 rounded-full border border-white/15"
                  style={{ backgroundColor: item.colorHex }}
                />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-display text-xs font-semibold text-bone">
                  {item.name}
                  <span className="ml-1.5 font-mono text-[10px] font-normal text-smoke">
                    ×{item.quantity}
                  </span>
                </p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-smoke">
                  {item.colorName} · {item.size}
                </p>
              </div>
              <span className="font-mono text-xs text-bone">
                ৳{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-white/8 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-smoke">Subtotal</span>
          <span className="font-mono text-xs text-bone">৳{subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-smoke">Shipping</span>
          <span className="font-mono text-xs text-bone">
            {shipping === 0 ? "Free" : `৳${shipping}`}
          </span>
        </div>
        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="font-mono text-[9px] text-electric">
            আরও ৳{FREE_SHIPPING_THRESHOLD - subtotal} কিনলে ফ্রি শিপিং
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 pt-3">
        <span className="font-mono text-xs uppercase tracking-widest text-smoke">
          Total
        </span>
        <span className="font-display text-xl font-bold text-ember">৳{total}</span>
      </div>
    </div>
  );
}
