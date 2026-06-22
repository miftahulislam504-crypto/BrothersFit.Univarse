"use client";

import { HALL_ZONES } from "@/lib/hallZones";
import { getPlaceholderProduct } from "@/lib/placeholderProducts";
import ProductPedestal from "./ProductPedestal";
import ZoneLabel from "./ZoneLabel";

interface HallLayoutProps {
  activeZoneId: string | null;
  selectedPedestalKey: string | null;
  onZoneSelect: (zoneId: string) => void;
  onProductSelect: (
    pedestalKey: string,
    worldPosition: [number, number, number]
  ) => void;
}

/**
 * সব zone-এর pedestal + label + multiple product placeholder
 * একসাথে layout করে। প্রতিটা zone-এ মূল pedestal-এর পাশে আরো দুইটা
 * ছোট pedestal রাখা হয়েছে, যাতে "একটা zone-এ একাধিক product" এই
 * ধারণাটা visually বোঝা যায়।
 *
 * Phase 6: প্রতিটা pedestal-এর নিজস্ব unique key আছে, যেটা click করলে
 * MainHallCanvas-কে জানানো হয় কোন pedestal এবং তার world position —
 * camera zoom-in animation সেই position-এর দিকে target করে।
 */
export default function HallLayout({
  activeZoneId,
  selectedPedestalKey,
  onZoneSelect,
  onProductSelect,
}: HallLayoutProps) {
  return (
    <>
      {HALL_ZONES.map((zone, zoneIndex) => {
        const [x, y, z] = zone.position;
        const isActive = activeZoneId === zone.id;

        // Side pedestal offset — main pedestal-এর দুই পাশে ছোট ছোট product
        const angleRad = (zone.angle * Math.PI) / 180;
        const sideOffsetX = Math.cos(angleRad) * 1.4;
        const sideOffsetZ = Math.sin(angleRad) * 1.4;

        const pedestals: { key: string; pos: [number, number, number]; idx: number }[] = [
          { key: `${zone.id}-0`, pos: [x, y, z], idx: 0 },
          { key: `${zone.id}-1`, pos: [x - sideOffsetZ, y, z + sideOffsetX], idx: 1 },
          { key: `${zone.id}-2`, pos: [x + sideOffsetZ, y, z - sideOffsetX], idx: 2 },
        ];

        return (
          <group key={zone.id}>
            {pedestals.map((p) => (
              <ProductPedestal
                key={p.key}
                position={p.pos}
                color={zone.color}
                product={getPlaceholderProduct(zone.id, p.idx)}
                phaseOffset={zoneIndex * 1.3 + p.idx * 0.7}
                isSelected={selectedPedestalKey === p.key}
                onSelect={() => {
                  onZoneSelect(zone.id);
                  onProductSelect(p.key, p.pos);
                }}
              />
            ))}

            {/* Zone label */}
            <ZoneLabel zone={zone} isActive={isActive} />
          </group>
        );
      })}
    </>
  );
}
