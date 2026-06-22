"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Neon Sign — "BROTHERFIT" বাক্সের উপরে।
 *
 * Three.js-এ font/text render করতে FontLoader + TextGeometry লাগে যেটা
 * external JSON font file দরকার করে। সেই dependency এড়াতে:
 * একটা glowing horizontal bar + point light দিয়ে neon effect তৈরি করা হচ্ছে।
 * 2D HTML overlay-এ actual "BROTHERFIT" text neon CSS দিয়ে দেখানো হবে
 * (ExteriorCanvas-এ), এবং এই 3D component টা শুধু volumetric glow দেয়।
 */
export default function NeonSign() {
  const glowBarRef  = useRef<THREE.Mesh>(null!);
  const lightRef    = useRef<THREE.PointLight>(null!);
  const light2Ref   = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Subtle flicker — real neon signs flicker occasionally
    const flicker = 1 + Math.sin(t * 47) * 0.008 + Math.sin(t * 13) * 0.015;

    if (lightRef.current)  lightRef.current.intensity  = 2.8 * flicker;
    if (light2Ref.current) light2Ref.current.intensity = 1.4 * flicker;

    if (glowBarRef.current) {
      const mat = glowBarRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.85 * flicker;
    }
  });

  // Sign sits above roof overhang of the building
  // building center is [0, -1.5, -8], roof top ~= [0, 3.7, -8+0.5]
  const signY = 3.8;
  const signZ = -7.2;

  return (
    <group position={[0, signY, signZ]}>

      {/* Backing plate — dark metal */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[4.2, 0.38, 0.08]} />
        <meshStandardMaterial color="#0c0c14" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Neon tube glow bar — ember orange */}
      <mesh ref={glowBarRef}>
        <boxGeometry args={[3.8, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff3d1a" transparent opacity={0.85} />
      </mesh>

      {/* Accent line — cyan below */}
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[3.8, 0.03, 0.06]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} />
      </mesh>

      {/* Main neon point light — ember */}
      <pointLight
        ref={lightRef}
        color="#ff3d1a"
        intensity={2.8}
        distance={6}
        decay={2}
        position={[0, 0, 0.2]}
      />

      {/* Secondary spread light — softer, wider */}
      <pointLight
        ref={light2Ref}
        color="#ff6030"
        intensity={1.4}
        distance={10}
        decay={2}
        position={[0, -0.5, 0.8]}
      />

    </group>
  );
}
