"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSafeTexture } from "@/hooks/useSafeTexture";

/**
 * Main Hall Room — পুরো 3D interior-এর ভিত্তি।
 *
 * Structure:
 *   - Circular reflective floor (center stage feel) — Step 2: এখন আসলেই
 *     reflective (MeshReflectorMaterial), আগে শুধু flat meshStandardMaterial ছিল
 *   - High ceiling with recessed light ring — এখন true emissive glow + bright core
 *   - Curved/distant boundary walls (vignette এর মতো কাজ করে, hard edge না)
 *   - Center floor emblem — BrotherFit logo glow ring
 */
interface HallRoomProps {
  /** ফোনে কম resolution-এ reflection আঁকার জন্য — desktop-এ true/full quality */
  isMobile?: boolean;
}

export default function HallRoom({ isMobile = false }: HallRoomProps) {
  const emblemRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  // Step 3.5: real marble texture optional — ফাইল public/textures/marble/-এ
  // রাখা থাকলে এখানেই load হয়ে যাবে, না রাখলে null আসবে আর floor আগের
  // মতোই solid color + reflection দেখাবে। কোনো crash নেই কোনো অবস্থাতেই।
  const marbleDiff = useSafeTexture("/textures/marble/marble_01_diff.jpg", 6);
  const marbleNorm = useSafeTexture("/textures/marble/marble_01_nor.jpg", 6);
  const marbleRough = useSafeTexture("/textures/marble/marble_01_rough.jpg", 6);
  const hasMarble = !!marbleDiff;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (emblemRef.current) {
      const mat = emblemRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 0.6) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group>
      {/* ── Floor ─────────────────────────────────────────────── */}
      {/* Step 2: flat meshStandardMaterial-এর বদলে আসল reflection —
          সব reference showroom ছবিতে এই polished floor-ই সবচেয়ে বেশি
          "real" অনুভূতি দেয়। resolution মোবাইলে কম রাখা হলো perf-এর জন্য। */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <circleGeometry args={[24, 64]} />
        <MeshReflectorMaterial
          resolution={isMobile ? 384 : 1024}
          blur={isMobile ? [200, 60] : [400, 120]}
          mixBlur={1}
          mixStrength={isMobile ? 28 : 45}
          mirror={0}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          map={marbleDiff ?? undefined}
          normalMap={marbleNorm ?? undefined}
          roughnessMap={marbleRough ?? undefined}
          color={hasMarble ? "#ffffff" : "#18181f"}
          roughness={hasMarble ? 0.45 : 0.35}
          metalness={hasMarble ? 0.1 : 0.5}
        />
      </mesh>

      {/* Center emblem — glowing ring on the floor, signature brand mark */}
      <mesh
        ref={emblemRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.58, 0]}
      >
        <ringGeometry args={[1.6, 1.75, 64]} />
        <meshStandardMaterial
          color="#1a0a05"
          emissive="#ff3d1a"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner thin ring — cyan accent */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.58, 0]}
      >
        <ringGeometry args={[1.2, 1.26, 64]} />
        <meshStandardMaterial
          color="#001a1e"
          emissive="#00f0ff"
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.5, 0]}>
        <circleGeometry args={[24, 64]} />
        <meshStandardMaterial color="#0e0e16" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Recessed ceiling light ring — Step 2: আগে flat opacity 0.25
          meshBasicMaterial ছিল, light react করতো না, তাই source হিসেবে
          প্রায় অদৃশ্যের মতো লাগতো। এখন emissive glow + ভেতরে একটা bright
          core line — real LED cove fixture-এর মতো পড়বে, আর নিচের
          reflective floor-এ এটা reflect-ও হবে। */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.45, 0]}>
        <ringGeometry args={[2.7, 3.3, 64]} />
        <meshStandardMaterial
          color="#1a1812"
          emissive="#fff4e0"
          emissiveIntensity={1.1}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.43, 0]}>
        <ringGeometry args={[2.95, 3.05, 64]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#ffffff"
          emissiveIntensity={2.2}
          roughness={0.2}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Boundary wall — large cylinder enclosing the hall ───── */}
      {/* Step 2: roughness একটু কমিয়ে metalness একটু বাড়ানো হলো, যাতে
          HDRI environment-এর হালকা reflection ধরা পড়ে — flat matte paint
          না লেগে polished dark wall panel-এর মতো লাগে। */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[23, 23, 9, 48, 1, true]} />
        <meshStandardMaterial
          color="#14141c"
          roughness={0.6}
          metalness={0.25}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
