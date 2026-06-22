"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap, Check } from "lucide-react";

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
}

/**
 * Add To Cart / Buy Now — দুটো button।
 * "Add to Cart" চাপলে এখন শুধু একটা confirmation flash দেখায়
 * (Phase 8-এ পূর্ণ cart animation/drawer বানানো হবে, এখন শুধু
 * intent capture করা হচ্ছে)। "Buy Now" সরাসরি checkout placeholder-এ যায়।
 */
export default function ProductActions({
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    setJustAdded(true);
    onAddToCart();
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="flex gap-3 pt-1">
      <button
        data-add-to-cart-source="true"
        onClick={handleAddToCart}
        className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/15 px-4 py-3.5 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:border-white/30"
      >
        <AnimatePresence mode="wait">
          {justAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 text-electric"
            >
              <Check size={14} strokeWidth={2} />
              Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={1.75} />
              Add to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <button
        onClick={onBuyNow}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3.5 font-mono text-xs uppercase tracking-widest text-void transition-opacity hover:opacity-90"
      >
        <Zap size={14} strokeWidth={2} />
        Buy Now
      </button>
    </div>
  );
}
