"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Exterior lighting rig।
 * - Ambient: খুব কম, void feel বজায় রাখতে
 * - Main directional: উপর থেকে নিচে, building-এ harsh shadow
 * - Ember point lights: neon sign-এর glow building-এ পড়ে
 * - Electric accent: door-এর ভেতর থেকে cyan glow
 * - Street light: একটা pole light, warm হলুদ
 * - Pulsing accent: dynamic রঙ পরিবর্তন
 */
export default function ExteriorLights() {
  const pulseLight1Ref = useRef<THREE.PointLight>(null!);
  const pulseLight2Ref = useRef<THREE.PointLight>(null!);
  const streetRef      = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Pulse 1 — ember, slow breathe
    if (pulseLight1Ref.current) {
      pulseLight1Ref.current.intensity = 1.6 + Math.sin(t * 0.8) * 0.4;
    }

    // Pulse 2 — cyan, offset phase
    if (pulseLight2Ref.current) {
      pulseLight2Ref.current.intensity = 1.1 + Math.sin(t * 1.1 + 1.5) * 0.3;
    }

    // Street light — mild warm flicker
    if (streetRef.current) {
      streetRef.current.intensity = 1.9 + Math.sin(t * 33) * 0.06;
    }
  });

  return (
    <>
      {/* Base ambient — keeps the building from going pure black */}
      <ambientLight intensity={0.4} color="#1c1c2c" />

      {/* Sky/ground bounce — evens out lighting across the whole facade,
          independent of point-light falloff */}
      <hemisphereLight color="#3a3a55" groundColor="#1a0e08" intensity={0.7} />

      {/* Key directional — top, slightly front, cool */}
      <directionalLight
        position={[2, 10, 4]}
        intensity={1.3}
        color="#c8d0e8"
        castShadow
      />

      {/* Fill from below — subtle bounce off pavement */}
      <directionalLight
        position={[0, -3, 3]}
        intensity={0.3}
        color="#3a1a08"
      />

      {/* Ember neon glow hitting the building facade */}
      <pointLight
        ref={pulseLight1Ref}
        position={[0, 3.6, -6.8]}
        color="#ff3d1a"
        intensity={1.6}
        distance={10}
        decay={2}
      />

      {/* Electric cyan from inside door */}
      <pointLight
        ref={pulseLight2Ref}
        position={[0, 0.6, -7.1]}
        color="#00f0ff"
        intensity={1.1}
        distance={8}
        decay={2}
      />

      {/* Street light — left pole */}
      <pointLight
        ref={streetRef}
        position={[-5, 4, -5]}
        color="#ffd580"
        intensity={1.9}
        distance={13}
        decay={2}
      />

      {/* Subtle right fill */}
      <pointLight
        position={[5, 2, -5]}
        color="#405068"
        intensity={1.2}
        distance={12}
        decay={2}
      />

      {/* Ground puddle reflection hint */}
      <pointLight
        position={[0, -1.3, -7]}
        color="#ff2a00"
        intensity={0.6}
        distance={7}
        decay={2}
      />
    </>
  );
}
