"use client";

import { Html } from "@react-three/drei";
import { HallZone } from "@/lib/hallZones";

interface ZoneLabelProps {
  zone: HallZone;
  isActive: boolean;
}

/**
 * Zone label — 3D world position-এ বসানো কিন্তু আসল render HTML/CSS দিয়ে।
 * Drei-র <Html> component 3D coordinate-কে screen-এ project করে,
 * তাই text সবসময় crisp থাকে (Three.js TextGeometry-র মতো blurry/pixelated না)
 * এবং কোনো external font file লোড করতে হয় না।
 */
export default function ZoneLabel({ zone, isActive }: ZoneLabelProps) {
  return (
    <Html
      position={[zone.position[0], 2.4, zone.position[2]]}
      center
      distanceFactor={10}
      occlude={false}
    >
      <div
        className={`pointer-events-none select-none whitespace-nowrap rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-md transition-all duration-500 ${
          isActive
            ? "scale-110 border-current opacity-100"
            : "scale-90 border-white/10 opacity-40"
        }`}
        style={{
          color: zone.color,
          backgroundColor: isActive ? `${zone.color}15` : "rgba(13,13,20,0.4)",
        }}
      >
        {zone.label}
      </div>
    </Html>
  );
}
