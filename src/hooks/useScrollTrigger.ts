"use client";

import { useEffect, useRef, useState } from "react";

/**
 * User-এর scroll/wheel/touch input detect করে।
 * Phase 1 → Phase 2 transition (arrival → exterior) এই hook trigger করে।
 * একবার fired হলে re-fire ঠেকাতে cooldown থাকে।
 */
export function useScrollTrigger(
  onScrollDown: () => void,
  enabled: boolean = true,
  cooldownMs: number = 1200
) {
  const lastFiredAt = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fire = () => {
      const now = Date.now();
      if (now - lastFiredAt.current < cooldownMs) return;
      lastFiredAt.current = now;
      setHasScrolled(true);
      onScrollDown();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) fire();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 40) fire();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "Space", "Enter"].includes(e.code)) {
        e.preventDefault();
        fire();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScrollDown, enabled, cooldownMs]);

  return { hasScrolled };
}
