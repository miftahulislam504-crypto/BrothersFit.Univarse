"use client";

import { useEffect, useRef } from "react";
import { HALL_ZONES } from "@/lib/hallZones";

/**
 * Zone-to-zone navigation — mobile swipe (left/right) এবং keyboard
 * arrow key (←/→) দিয়ে। HALL_ZONES array-এর angle অনুযায়ী sorted
 * order-এ "পরের" এবং "আগের" zone বের করা হয়।
 *
 * এটা HallCameraRig-এর drag-to-rotate থেকে আলাদা — drag হলো free-form
 * continuous rotation, আর এই hook হলো discrete "next/prev zone" jump,
 * অনেকটা gallery-তে left/right arrow চেপে পরের ছবিতে যাওয়ার মতো।
 */
export function useZoneSwipeNav(
  activeZoneId: string | null,
  onNavigate: (zoneId: string) => void,
  enabled: boolean = true
) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const sortedZones = [...HALL_ZONES].sort((a, b) => a.angle - b.angle);

  const goToAdjacent = (direction: 1 | -1) => {
    const currentIndex = activeZoneId
      ? sortedZones.findIndex((z) => z.id === activeZoneId)
      : 0;
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex =
      (safeIndex + direction + sortedZones.length) % sortedZones.length;
    onNavigate(sortedZones[nextIndex].id);
  };

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") {
        e.preventDefault();
        goToAdjacent(1);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        goToAdjacent(-1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Horizontal swipe only — vertical swipe বাদ দেওয়া হচ্ছে যাতে
      // scroll/drag gesture-এর সাথে conflict না হয়
      if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) goToAdjacent(1); // swipe left → next zone
        else goToAdjacent(-1); // swipe right → prev zone
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, activeZoneId]);

  return { goToAdjacent };
}
