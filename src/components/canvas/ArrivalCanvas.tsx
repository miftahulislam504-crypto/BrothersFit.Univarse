"use client";

import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "./ParticleField";
import EmberParticles from "./EmberParticles";
import CameraRig from "./CameraRig";
import { useUniverseStore } from "@/store/useUniverseStore";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";

/**
 * Phase 1: Full 3D Arrival Scene।
 * Three.js Canvas + 2D overlay (title text) একসাথে।
 *
 * Performance strategy:
 * - AdaptiveDpr: mobile-এ pixel ratio কমিয়ে GPU load কমায়
 * - AdaptiveEvents: frame drop হলে event throttle করে
 * - particle count: isMobile ? 500 : 1200
 * - reduced-motion: prefers-reduced-motion সত্যি হলে সব animation বন্ধ
 */

function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ArrivalCanvas() {
  const setScene = useUniverseStore((state) => state.setScene);
  const [isMovingForward, setIsMovingForward] = useState(false);
  const [titleVisible, setTitleVisible] = useState(true);

  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const handleScrollDown = useCallback(() => {
    if (isMovingForward) return;
    setTitleVisible(false);
    setTimeout(() => setIsMovingForward(true), 300);
  }, [isMovingForward]);

  const handleForwardComplete = useCallback(() => {
    setScene("exterior");
  }, [setScene]);

  const { } = useScrollTrigger(handleScrollDown, !isMovingForward);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-void">
      {/* Three.js Canvas — full screen background */}
      <div className="scene-canvas">
        <Canvas
          camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 100 }}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? "default" : "high-performance",
            // Step 5: Exterior+Hall দুটোতেই 1.3 আছে — Arrival-এ missing ছিল।
            // 3টা scene-এ same exposure → journey-তে brightness flicker নেই।
            toneMappingExposure: 1.3,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          {!reducedMotion && (
            <Suspense fallback={null}>
              {/* Step 5: Arrival-এ Environment ছিলই না — particle-এর ember/cyan
                  color গুলো IBL pick করে না (meshBasicMaterial), কিন্তু ভবিষ্যতে
                  কোনো geometry যোগ হলে আপনা-আপনি correct ambient পাবে।
                  "night" preset: dark starfield IBL, void/space feel বজায় রাখে। */}
              <Environment preset="night" environmentIntensity={0.2} />

              <ParticleField
                count={isMobile ? 500 : 1200}
                forwardSpeed={isMovingForward ? 3.5 : 0}
                dissolving={isMovingForward}
              />
              <EmberParticles count={isMobile ? 25 : 60} />
              <CameraRig
                isMovingForward={isMovingForward}
                onForwardComplete={handleForwardComplete}
              />
            </Suspense>
          )}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Canvas>
      </div>

      {/* 2D overlay — title text, floating above the 3D canvas */}
      <AnimatePresence>
        {titleVisible && (
          <motion.div
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Radial glow — signature element */}
            <div className="pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-ember/8 blur-[140px]" />
            <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full bg-electric/5 blur-[90px]" />

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.15em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] uppercase text-smoke md:text-xs"
            >
              Welcome To
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-center font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-bone sm:text-7xl md:text-8xl lg:text-9xl"
            >
              Brother
              <span className="block text-ember neon-text">Fit</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1.2 }}
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-smoke md:text-xs"
            >
              Universe
            </motion.p>

            {/* Scroll CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="pointer-events-auto absolute bottom-12 flex flex-col items-center gap-4"
            >
              <button
                onClick={handleScrollDown}
                className="group flex flex-col items-center gap-3 text-smoke transition-colors duration-300 hover:text-bone focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ember"
                aria-label="Enter BrotherFit Universe"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] md:text-xs">
                  Scroll To Enter
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                  className="flex h-8 w-5 items-start justify-center rounded-full border border-current pt-1.5"
                >
                  <div className="h-1.5 w-0.5 rounded-full bg-current" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forward transition overlay — screen dark হয়ে যাবে */}
      <AnimatePresence>
        {isMovingForward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pointer-events-none absolute inset-0 bg-void"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
