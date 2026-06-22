"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import HallRoom from "./hall/HallRoom";
import HallArchitecture from "./hall/HallArchitecture";
import HallLights from "./hall/HallLights";
import HallDust from "./hall/HallDust";
import HallLayout from "./hall/HallLayout";
import HallCameraRig from "./hall/HallCameraRig";
import { SafeAsset } from "./SafeAsset";
import SceneBloom from "./effects/SceneBloom";
import MiniMap from "@/components/ui/hall/MiniMap";
import ZoneInfoPanel from "@/components/ui/hall/ZoneInfoPanel";
import TopNavBar from "@/components/ui/nav/TopNavBar";
import SearchOverlay from "@/components/ui/nav/SearchOverlay";
import SwipeHint from "@/components/ui/nav/SwipeHint";
import { useUniverseStore } from "@/store/useUniverseStore";
import { useZoneSwipeNav } from "@/hooks/useZoneSwipeNav";
import { HALL_ZONES, getZoneById } from "@/lib/hallZones";

function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Main Hall — 3D Shop Interior + Phase 5 Navigation Layer।
 *
 * Phase 5 update: এখন এই scene-এ পূর্ণ navigation layer যুক্ত হয়েছে —
 * - TopNavBar: Home / Collections / Best Sellers / Sale + Search/Cart/Profile icon
 * - SearchOverlay: full-screen AI-powered product search
 * - Swipe (mobile) ও Arrow key (desktop) দিয়ে zone-to-zone navigation
 * - Mini-map (Phase 3 থেকেই ছিল) এখনো কাজ করে, TopNavBar-এর পরিপূরক
 *
 * User এখানে center-এ দাঁড়িয়ে:
 * - Mouse/touch drag করে চারপাশে ঘুরে দেখে (HallCameraRig — continuous)
 * - Swipe/arrow key দিয়ে discrete zone-to-zone jump করে (নতুন)
 * - TopNavBar/mini-map/search দিয়ে সরাসরি যেকোনো zone-এ jump করে
 * - Pedestal click করলে camera zoom-in → productDetail scene
 */
export default function MainHallCanvas() {
  const setScene = useUniverseStore((s) => s.setScene);
  const setSelectedProductId = useUniverseStore((s) => s.setSelectedProductId);
  const isSearchOpen = useUniverseStore((s) => s.isSearchOpen);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [targetAngle, setTargetAngle] = useState<number | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [showIntroHint, setShowIntroHint] = useState(true);

  const [selectedPedestalKey, setSelectedPedestalKey] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<[number, number, number] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleZoneSelect = useCallback((zoneId: string) => {
    const zone = getZoneById(zoneId);
    if (!zone) return;
    setActiveZoneId(zoneId);
    setTargetAngle(zone.angle);
    setShowIntroHint(false);
  }, []);

  // Phase 5: swipe (mobile) ও arrow key (desktop) দিয়ে zone navigation।
  // Search overlay খোলা থাকলে বা product zoom transition চলাকালীন বন্ধ থাকে।
  useZoneSwipeNav(
    activeZoneId,
    handleZoneSelect,
    !isSearchOpen && !isTransitioning
  );

  const handleProductSelect = useCallback(
    (pedestalKey: string, worldPosition: [number, number, number]) => {
      if (isTransitioning) return;
      setSelectedPedestalKey(pedestalKey);
      setSelectedProductId(pedestalKey);
      setZoomTarget(worldPosition);
      setIsTransitioning(true);
    },
    [isTransitioning, setSelectedProductId]
  );

  const handleZoomComplete = useCallback(() => {
    setTimeout(() => setScene("productDetail"), 450);
  }, [setScene]);

  const handleAngleChange = useCallback((angle: number) => {
    setCurrentAngle(angle);
  }, []);

  const activeZone = activeZoneId ? getZoneById(activeZoneId) ?? null : null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-void">

      {/* ── Three.js Canvas ───────────────────────────────────── */}
      <div className="scene-canvas">
        <Canvas
          camera={{ position: [0, 0.6, 0], fov: 72, near: 0.05, far: 60 }}
          gl={{
            antialias: !isMobile,
            alpha: false,
            // "low-power" mobile GPU-কে battery-saving tier-এ পাঠিয়ে দেয় যেটা
            // visual quality-র সাথে উল্টো দিকে কাজ করে — "default" রাখলে browser
            // context অনুযায়ী সেরা GPU বেছে নেয়, AdaptiveDpr বাকিটা সামলায়।
            powerPreference: isMobile ? "default" : "high-performance",
            toneMappingExposure: 1.3,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          shadows
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={["#05050a", 14, 30]} />

            {/* Step 3.5: custom HDRI optional — public/hdri/decor-shop.hdr
                রাখা থাকলে সেটাই load হবে (real shop-interior mood),
                না থাকলে drei-র "lobby" preset-এই থাকবে (CDN থেকে আসে,
                আগের মতোই কাজ করে)। SafeAsset দুই অবস্থাতেই crash আটকায়। */}
            <SafeAsset
              fallback={<Environment preset="lobby" environmentIntensity={0.65} />}
            >
              <Suspense fallback={<Environment preset="lobby" environmentIntensity={0.65} />}>
                <Environment files="/hdri/decor-shop.hdr" environmentIntensity={0.65} />
              </Suspense>
            </SafeAsset>

            <HallLights />
            <HallRoom isMobile={isMobile} />
            <HallArchitecture isMobile={isMobile} />

            {!reducedMotion && <HallDust count={isMobile ? 90 : 200} />}

            <HallLayout
              activeZoneId={activeZoneId}
              selectedPedestalKey={selectedPedestalKey}
              onZoneSelect={handleZoneSelect}
              onProductSelect={handleProductSelect}
            />

            <HallCameraRig
              targetAngle={targetAngle}
              zoomTarget={zoomTarget}
              onAngleChange={handleAngleChange}
              onZoomComplete={handleZoomComplete}
            />
          </Suspense>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Step 6: Bloom — desktop only, mobile-এ null রিটার্ন করে (zero cost)।
              threshold 0.85 → শুধু ছাদের LED ring (emissiveIntensity 2.2),
              pedestal glow ring, আর emblem ring bloom করবে।
              ambient light বা wall material bloom করবে না। */}
          <SceneBloom
            isMobile={isMobile}
            luminanceThreshold={0.85}
            intensity={0.45}
          />
        </Canvas>
      </div>

      {/* ── 2D Overlay ────────────────────────────────────────── */}

      {/* Phase 5: Top navigation bar — Home/Collections/Best Sellers/Sale + icons */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div exit={{ opacity: 0, y: -8 }} className="absolute inset-x-0 top-0">
            <TopNavBar activeZoneId={activeZoneId} onZoneJump={handleZoneSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-right: mini map — desktop-এ TopNavBar-এর নিচে বসে, zoom শুরু হলে fade out */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute right-6 top-20 hidden md:block"
          >
            <MiniMap
              currentAngle={currentAngle}
              activeZoneId={activeZoneId}
              onZoneClick={handleZoneSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom: active zone info panel */}
      {!isTransitioning && <ZoneInfoPanel zone={activeZone} />}

      {/* Mobile swipe hint — left/right edge arrows */}
      <SwipeHint visible={showIntroHint && !isTransitioning} />

      {/* Intro hint — drag to look around */}
      <AnimatePresence>
        {showIntroHint && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="h-10 w-10 rounded-full border border-bone/30"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-smoke">
                Drag to Look Around
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-smoke/50 md:hidden">
                Swipe Left/Right for Zones
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-left: zone count indicator */}
      {!isTransitioning && (
        <div className="pointer-events-none absolute bottom-6 left-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-smoke/40">
            {HALL_ZONES.length} Zones · Tap a pedestal to explore
          </p>
        </div>
      )}

      {/* Zoom transition label — "Loading Product..." */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-ember neon-text">
              Loading Product...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blackout overlay — covers the hard-cut to productDetail scene */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="pointer-events-none absolute inset-0 bg-void"
          />
        )}
      </AnimatePresence>

      {/* Phase 5: Search overlay — full screen, opens via TopNavBar search icon */}
      <SearchOverlay onZoneJump={handleZoneSelect} />

    </div>
  );
}
