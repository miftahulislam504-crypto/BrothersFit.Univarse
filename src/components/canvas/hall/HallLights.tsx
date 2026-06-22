"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HALL_ZONES } from "@/lib/hallZones";

/**
 * Main Hall লাইটিং।
 * - Soft ambient: পুরো room visible রাখে কিন্তু dark/moody টোন বজায় রাখে
 * - Center spotlight: floor emblem-এর উপর
 * - Ceiling ring glow: উপর থেকে diffused light
 * - প্রতিটা zone নিজস্ব accent light পায় (zone color অনুযায়ী)
 */
export default function HallLights() {
  const centerLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (centerLightRef.current) {
      centerLightRef.current.intensity = 2.4 + Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <>
      {/* Base ambient — keeps the hall from being pure black */}
      <ambientLight intensity={0.45} color="#1c1c2c" />

      {/* Soft hemisphere light — ceiling glow bouncing down, floor reflecting up */}
      <hemisphereLight
        color="#3a3a55"
        groundColor="#2a1010"
        intensity={0.9}
      />

      {/* Center floor emblem spotlight */}
      <pointLight
        ref={centerLightRef}
        position={[0, 3, 0]}
        color="#ff3d1a"
        intensity={2.4}
        distance={14}
        decay={2}
      />

      {/* Ceiling ring fill light */}
      <pointLight position={[0, 6, 0]} color="#f2efe9" intensity={1.1} distance={26} decay={2} />

      {/* Per-zone accent lighting */}
      {HALL_ZONES.map((zone) => (
        <pointLight
          key={zone.id}
          position={[zone.position[0], 2.2, zone.position[2]]}
          color={zone.color}
          intensity={1.1}
          distance={8}
          decay={2}
        />
      ))}
    </>
  );
}
