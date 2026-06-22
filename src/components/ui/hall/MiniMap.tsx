"use client";

import { motion } from "framer-motion";
import { HALL_ZONES } from "@/lib/hallZones";

interface MiniMapProps {
  currentAngle: number;
  activeZoneId: string | null;
  onZoneClick: (zoneId: string) => void;
}

/**
 * Mini Map — top-right corner-এ ছোট radial diagram।
 * Center dot = user, চারপাশের dot-গুলো = zone। Camera যেদিকে তাকিয়ে
 * আছে সেটা একটা নির্দেশক line দিয়ে দেখানো হয়।
 */
export default function MiniMap({
  currentAngle,
  activeZoneId,
  onZoneClick,
}: MiniMapProps) {
  const mapSize = 120;
  const center = mapSize / 2;
  const zoneRadius = 42;

  // Normalize angle to 0-360
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;

  return (
    <div className="glass-panel rounded-2xl p-3">
      <p className="mb-2 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-smoke/60">
        Hall Map
      </p>
      <div
        className="relative"
        style={{ width: mapSize, height: mapSize }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-bone/10" />

        {/* Direction indicator — shows where camera is looking */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-px w-[42px] origin-left bg-gradient-to-r from-ember to-transparent"
          style={{
            rotate: normalizedAngle - 90,
          }}
          transition={{ type: "tween", duration: 0.1 }}
        />

        {/* Center dot — user position */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone" />

        {/* Zone dots */}
        {HALL_ZONES.map((zone) => {
          const rad = (zone.angle * Math.PI) / 180;
          const x = center + Math.sin(rad) * zoneRadius;
          const y = center - Math.cos(rad) * zoneRadius;
          const isActive = activeZoneId === zone.id;

          return (
            <button
              key={zone.id}
              onClick={() => onZoneClick(zone.id)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: x, top: y }}
              aria-label={zone.label}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive ? "h-3 w-3" : "h-1.5 w-1.5"
                }`}
                style={{
                  backgroundColor: zone.color,
                  boxShadow: isActive ? `0 0 8px ${zone.color}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
