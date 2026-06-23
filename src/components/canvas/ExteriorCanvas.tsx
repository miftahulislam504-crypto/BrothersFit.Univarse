use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import ShopBuilding from "./exterior/ShopBuilding";
import GlassDoor from "./exterior/GlassDoor";
import NeonSign from "./exterior/NeonSign";
import Rain from "./exterior/Rain";
import ExteriorLights from "./exterior/ExteriorLights";
import WetPavement from "./exterior/WetPavement";
import ExteriorCameraRig from "./exterior/ExteriorCameraRig";
import { SafeAsset } from "./SafeAsset";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useUniverseStore } from "@/store/useUniverseStore";

function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Phase 2: Shop Exterior Scene
 *
 * User journey এই scene-এ:
 * 1. Building দেখতে পায়, rain পড়ছে, neon sign জ্বলছে
 * 2. Scroll করে → door ধীরে খুলে যায়
 * 3. আরো scroll → camera এগিয়ে দরজার দিকে যায়
 * 4. শেষে camera door পার করে ভেতরে ঢোকে → Phase 3 (mainHall)
 *
 * scrollProgress 0→1:
 *   0.0–0.3 : idle, door বন্ধ
 *   0.3–0.7 : door খুলছে
 *   0.7–0.85: camera door-এর কাছে আসছে
 *   0.85–1.0: camera ভেতরে rush করে ঢুকছে
 */
export default function ExteriorCanvas() {
  const setScene = useUniverseStore((s) => s.setScene);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const [entryStarted, setEntryStarted] = useState(false);
  const scrollProgress = useScrollProgress(!entryStarted);

  // Door opening starts at scroll 0.3, completes at 0.7
  const doorProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4));

  const handleEntryComplete = useCallback(() => {
    setEntryStarted(true);
    setTimeout(() => setScene("mainHall"), 400);
  }, [setScene]);

  // Hint text disappears once scroll starts
  const showHint = scrollProgress < 0.05;
  // Door label changes as progress grows
  const doorLabel =
    scrollProgress < 0.3
      ? "SCROLL TO OPEN"
      : scrollProgress < 0.75
      ? "ENTERING..."
      : "STEP INSIDE";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-void">

      {/* ── Three.js Canvas ───────────────────────────────────── */}
      <div className="scene-canvas">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 65, near: 0.05, far: 80 }}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? "default" : "high-performance",
            toneMappingExposure: 1.3,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          shadows
        >
          <Suspense fallback={null}>
            {/* Atmosphere fog — distance-based depth */}
            <fog attach="fog" args={["#03030a", 8, 30]} />

            {/* Step 5: "night" preset → "city" preset।
                "night" ছিল starfield-type IBL — রাতের শহরের বিল্ডিং/neon-এ
                যে warm-artificial-light ambient থাকে সেটা দিতে পারছিল না।
                "city" preset urban artificial lighting-based — wet pavement-এ
                এখন neon color-গুলোর IBL reflection সঠিকভাবে ধরা পড়বে।
                Custom HDRI optional: public/hdri/night-street.hdr রাখলে upgrade,
                না থাকলে "city" preset-এই চলবে। */}
            <SafeAsset
              fallback={<Environment preset="city" environmentIntensity={0.55} />}
            >
              <Suspense fallback={<Environment preset="city" environmentIntensity={0.55} />}>
                <Environment files="/hdri/night-street.hdr" environmentIntensity={0.55} />
              </Suspense>
            </SafeAsset>

            <ExteriorLights />
            <ShopBuilding />
            <GlassDoor openProgress={doorProgress} />
            <NeonSign />
            <WetPavement isMobile={isMobile} />

            {!reducedMotion && (
              <Rain
                count={isMobile ? 250 : 600}
                intensity={isMobile ? 0.5 : 1}
              />
            )}

            <ExteriorCameraRig
              scrollProgress={scrollProgress}
              onEntryComplete={handleEntryComplete}
            />
          </Suspense>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Canvas>
      </div>

      {/* ── 2D Overlay ────────────────────────────────────────── */}

      {/* Top-left: scene label */}
      <div className="pointer-events-none absolute left-6 top-6 flex flex-col gap-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-smoke/50">
          BrotherFit Universe
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-smoke/30">
          Shop Exterior
        </p>
      </div>

      {/* Top-right: audio toggle */}
      <div className="absolute right-6 top-6">
        <button
          className="glass-panel rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-smoke transition-colors hover:text-bone"
          aria-label="Toggle ambient sound"
        >
          ♪ Sound
        </button>
      </div>

      {/* Neon sign text overlay — sits above the 3D glow bar */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: "12%" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="font-display text-xl font-extrabold uppercase tracking-[0.22em] text-ember neon-text sm:text-2xl md:text-3xl"
        >
          BrotherFit
        </motion.p>
      </div>

      {/* Scroll hint — bottom center */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-smoke">
              Scroll to Enter
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="flex h-7 w-4 items-start justify-center rounded-full border border-smoke/30 pt-1"
            >
              <div className="h-1.5 w-0.5 rounded-full bg-smoke/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Door status label — near bottom, appears when scrolling */}
      <AnimatePresence>
        {scrollProgress > 0.05 && !entryStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-electric neon-text-cyan">
              {doorLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar — left edge, vertical */}
      <div className="pointer-events-none absolute bottom-8 left-5 top-8 w-px overflow-hidden bg-bone/5">
        <motion.div
          className="w-full bg-ember/50"
          style={{ height: `${scrollProgress * 100}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>

      {/* Entry blackout overlay */}
      <AnimatePresence>
        {scrollProgress > 0.92 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollProgress > 0.97 ? 1 : (scrollProgress - 0.92) / 0.05 }}
            className="pointer-events-none absolute inset-0 bg-void"
          />
        )}
      </AnimatePresence>

    </div>
  );
}
