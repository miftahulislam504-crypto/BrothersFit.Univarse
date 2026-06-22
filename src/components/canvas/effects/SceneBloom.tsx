"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface SceneBloomProps {
  isMobile: boolean;
  /**
   * কোন brightness-এর উপর থেকে bloom শুরু হবে [0–1]।
   * Hall interior (LED cove emissive 2.2): 0.85 — শুধু সত্যিকারের উজ্জ্বল source
   * Exterior neon (meshBasicMaterial): 0.75 — neon bar range-এ পড়ে
   * Arrival particle: 0.7 — ember/cyan particle-এর saturation ধরতে
   */
  luminanceThreshold?: number;
  /**
   * Bloom strength। বেশি দিলে আলো "ছড়িয়ে পড়ে" পুরো screen জুড়ে।
   * Interior-এ modest রাখা হলো (0.4) — luxury feel বজায় রাখতে।
   * Exterior neon-এ একটু বেশি (0.55) — রাতের neon sign real-এ এভাবেই দেখায়।
   */
  intensity?: number;
}

/**
 * Step 6 — Postprocessing Bloom।
 *
 * কেন mobile-এ বন্ধ:
 *   EffectComposer একটা অতিরিক্ত full-screen render pass চালায়।
 *   `intensity: 0` করলেও pass চলতেই থাকে — GPU time যায়। mobile-এ
 *   পুরোপুরি mount না করলে সেই cost একদম শূন্য হয়।
 *
 * কেন multisampling={4}:
 *   Canvas-এর gl.antialias EffectComposer-এর নিজস্ব render pipeline-এ
 *   কাজ করে না। multisampling={4} EffectComposer-এর ভেতরে 4x MSAA চালায়
 *   → desktop-এ antialias বজায় থাকে।
 *
 * কেন Suspense মোড়ানো:
 *   Bloom-এর shader প্রথমবার compile হতে কিছু সময় লাগে। Suspense দিয়ে
 *   scene আগে render হয়, bloom পরে kick in করে — blank frame নেই।
 *
 * কেন mipmapBlur:
 *   postprocessing 6.23+ এ mipmap-based blur: পুরোনো Gaussian blur-এর
 *   তুলনায় GPU-তে অনেক হালকা, quality বেশি।
 */
export default function SceneBloom({
  isMobile,
  luminanceThreshold = 0.85,
  intensity = 0.4,
}: SceneBloomProps) {
  // Mobile-এ EffectComposer mount-ই করছি না — null রিটার্ন → zero cost।
  // শুধু intensity=0 করলে pass তবুও চলতো।
  if (isMobile) return null;

  return (
    <Suspense fallback={null}>
      <EffectComposer multisampling={4}>
        <Bloom
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={0.025}
          mipmapBlur
          intensity={intensity}
        />
      </EffectComposer>
    </Suspense>
  );
}
