"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlassDoorProps {
  /** 0 = সম্পূর্ণ বন্ধ, 1 = সম্পূর্ণ খোলা */
  openProgress: number;
}

/**
 * Glass Door — দুটো panel (left + right) যেগুলো
 * openProgress অনুযায়ী outward slide করে।
 * Camera inside ঢোকার আগেই door খোলা শেষ হয়।
 */
export default function GlassDoor({ openProgress }: GlassDoorProps) {
  const leftDoorRef  = useRef<THREE.Mesh>(null!);
  const rightDoorRef = useRef<THREE.Mesh>(null!);
  const glowRef      = useRef<THREE.Mesh>(null!);

  // Door-এর frame position (building-এর center, ground floor)
  const doorY   = 0.6;
  const doorZ   = 0.74;
  const doorW   = 0.88; // half-width of one panel
  const maxSlide = 1.05;

  useFrame(() => {
    if (!leftDoorRef.current || !rightDoorRef.current) return;

    // Ease the progress for smoother feel
    const eased =
      openProgress < 0.5
        ? 2 * openProgress * openProgress
        : 1 - Math.pow(-2 * openProgress + 2, 2) / 2;

    leftDoorRef.current.position.x  = -doorW - eased * maxSlide;
    rightDoorRef.current.position.x =  doorW + eased * maxSlide;

    // Glow intensifies as door opens
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + eased * 0.25;
    }
  });

  // Door frame
  const frameMat = (
    <meshStandardMaterial color="#1c1c28" roughness={0.2} metalness={0.9} />
  );

  return (
    <group position={[0, doorY - 1.5, doorZ - 8]}>

      {/* Door frame — top */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[1.98, 0.1, 0.06]} />
        {frameMat}
      </mesh>
      {/* Door frame — left side */}
      <mesh position={[-0.96, 0.72, 0]}>
        <boxGeometry args={[0.08, 1.78, 0.06]} />
        {frameMat}
      </mesh>
      {/* Door frame — right side */}
      <mesh position={[0.96, 0.72, 0]}>
        <boxGeometry args={[0.08, 1.78, 0.06]} />
        {frameMat}
      </mesh>

      {/* Left door panel */}
      <mesh ref={leftDoorRef} position={[-doorW, 0.72, 0]}>
        <boxGeometry args={[doorW * 2 - 0.06, 1.62, 0.04]} />
        <meshPhysicalMaterial
          color="#001a2e"
          roughness={0.0}
          metalness={0.0}
          transmission={0.88}
          thickness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Right door panel */}
      <mesh ref={rightDoorRef} position={[doorW, 0.72, 0]}>
        <boxGeometry args={[doorW * 2 - 0.06, 1.62, 0.04]} />
        <meshPhysicalMaterial
          color="#001a2e"
          roughness={0.0}
          metalness={0.0}
          transmission={0.88}
          thickness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Interior glow — electric blue light bleeds through glass */}
      <mesh ref={glowRef} position={[0, 0.72, -0.15]}>
        <planeGeometry args={[1.8, 1.62]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}
