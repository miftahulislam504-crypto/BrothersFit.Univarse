"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll/wheel input-কে smooth 0–1 progress-এ convert করে।
 * এই value-টা GlassDoor-এর openProgress, ExteriorCameraRig-এর
 * scrollProgress, এবং scene transition সবকিছু drive করে।
 *
 * Features:
 * - Momentum: ছেড়ে দিলেও একটু এগোয়, natural feel দেয়
 * - Touch support: swipe up = scroll down
 * - Keyboard: ArrowDown/Space
 * - Clamp: 0 এর নিচে বা 1 এর উপরে যাবে না
 */
export function useScrollProgress(enabled: boolean = true) {
  const [progress, setProgress] = useState(0);
  const rawRef = useRef(0);
  const velocityRef = useRef(0);
  const touchStartRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // Smooth inertia loop — runs every frame
    const tick = () => {
      velocityRef.current *= 0.88; // friction
      rawRef.current = Math.max(0, Math.min(1, rawRef.current + velocityRef.current));
      setProgress((prev) => {
        const next = rawRef.current;
        // Only update state if meaningfully changed (avoid micro re-renders)
        return Math.abs(next - prev) > 0.0005 ? next : prev;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normalize wheel delta across browsers
      const delta = e.deltaY / 800;
      velocityRef.current += delta * 0.06;
      velocityRef.current = Math.max(-0.02, Math.min(0.04, velocityRef.current));
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartRef.current - e.touches[0].clientY) / 400;
      touchStartRef.current = e.touches[0].clientY;
      velocityRef.current += delta * 0.08;
      velocityRef.current = Math.max(-0.02, Math.min(0.04, velocityRef.current));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.code === "Space") {
        e.preventDefault();
        velocityRef.current += 0.018;
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        velocityRef.current -= 0.01;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  return progress;
}
