"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HallZone } from "@/lib/hallZones";

interface ZoneInfoPanelProps {
  zone: HallZone | null;
}

/**
 * Active zone-এর নাম bottom-center-এ দেখায়, ঠিক যেন museum/gallery
 * placard। Zone পরিবর্তন হলে smooth crossfade হয়।
 */
export default function ZoneInfoPanel({ zone }: ZoneInfoPanelProps) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {zone && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel flex flex-col items-center gap-1 rounded-2xl px-6 py-3"
          >
            <p
              className="font-display text-base font-bold uppercase tracking-wide sm:text-lg"
              style={{ color: zone.color }}
            >
              {zone.label}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-smoke">
              {zone.labelBn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
