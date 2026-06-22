"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverseStore } from "@/store/useUniverseStore";

/**
 * Phase 8: Fly-to-Cart Animation।
 *
 * "Add to Cart" চাপলে store-এ `flyToCartSignal` সেট হয় (নতুন id + color
 * দিয়ে)। এই component সেই signal শোনে এবং একটা ছোট গোলাকার "product
 * chip" button-এর position থেকে cart icon-এর position-এ উড়িয়ে নিয়ে যায়,
 * curved arc path-এ (just straight line না — bag-এ "পড়ে যাওয়ার" feel
 * দিতে একটু parabolic motion ব্যবহার করা হয়েছে)।
 *
 * Cart icon-এর exact position বের করতে `data-cart-icon-target` attribute
 * দেওয়া DOM element খোঁজা হয় (TopNavBar-এর cart button-এ বসানো আছে)।
 * পাওয়া না গেলে (যেমন mobile menu বন্ধ অবস্থায়) screen-এর top-right
 * কোণে fallback করে।
 */
export default function FlyToCartOverlay() {
  const flyToCartSignal = useUniverseStore((s) => s.flyToCartSignal);
  const [activeFlight, setActiveFlight] = useState<{
    id: number;
    colorHex: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const lastSignalId = useRef<number | null>(null);

  useEffect(() => {
    if (!flyToCartSignal || flyToCartSignal.id === lastSignalId.current) return;
    lastSignalId.current = flyToCartSignal.id;

    // Add to Cart button-এর position বের করা — এই overlay যেহেতু পুরো স্ক্রিন
    // জুড়ে বসে, তাই source position approximate করা হচ্ছে button-এর
    // known DOM attribute দিয়ে।
    const sourceEl = document.querySelector('[data-add-to-cart-source="true"]');

    // ডেস্কটপ আর মোবাইল — দুটো cart icon-ই DOM-এ থাকে (CSS দিয়ে hidden
    // হয় শুধু একটা)। visible (non-zero size) element-টাই আসল target।
    const targetCandidates = document.querySelectorAll(
      '[data-cart-icon-target="true"]'
    );
    let targetRect: DOMRect | undefined;
    targetCandidates.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) targetRect = rect;
    });

    const sourceRect = sourceEl?.getBoundingClientRect();

    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth / 2;
    const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight / 2;
    const endX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 40;
    const endY = targetRect ? targetRect.top + targetRect.height / 2 : 40;

    setActiveFlight({
      id: flyToCartSignal.id,
      colorHex: flyToCartSignal.colorHex,
      startX,
      startY,
      endX,
      endY,
    });

    const timeout = setTimeout(() => setActiveFlight(null), 750);
    return () => clearTimeout(timeout);
  }, [flyToCartSignal]);

  return (
    <AnimatePresence>
      {activeFlight && (
        <motion.div
          key={activeFlight.id}
          initial={{
            left: activeFlight.startX,
            top: activeFlight.startY,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            left: activeFlight.endX,
            top: [activeFlight.startY, activeFlight.endY - 70, activeFlight.endY],
            opacity: [1, 1, 0.85],
            scale: [1, 0.85, 0.25],
          }}
          transition={{
            duration: 0.7,
            ease: [0.45, 0, 0.55, 1],
            top: { duration: 0.7, times: [0, 0.55, 1], ease: "easeInOut" },
            scale: { duration: 0.7, times: [0, 0.6, 1] },
            opacity: { duration: 0.7, times: [0, 0.6, 1] },
          }}
          className="pointer-events-none fixed z-[60] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: activeFlight.colorHex,
            boxShadow: `0 0 16px ${activeFlight.colorHex}`,
          }}
        />
      )}
    </AnimatePresence>
  );
}
