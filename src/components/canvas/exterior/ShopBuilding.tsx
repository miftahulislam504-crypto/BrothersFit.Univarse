"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Shop Building — Three.js primitives দিয়ে তৈরি।
 * কোনো external .glb / .gltf model দরকার নেই।
 * Structure:
 *   - Main body (dark concrete wall)
 *   - Facade trim (metallic border)
 *   - Window panels (glass material)
 *   - Roof overhang
 *   - Floor/pavement
 *   - Side walls
 */
export default function ShopBuilding() {
  const buildingRef = useRef<THREE.Group>(null!);

  // Subtle building sway — gives life to the static geometry
  useFrame((state) => {
    if (!buildingRef.current) return;
    const t = state.clock.elapsedTime;
    buildingRef.current.rotation.y = Math.sin(t * 0.12) * 0.004;
  });

  return (
    <group ref={buildingRef} position={[0, -1.5, -8]}>

      {/* ── Main Body ─────────────────────────────────────────── */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 5.5, 1.4]} />
        <meshStandardMaterial
          color="#1c1c26"
          roughness={0.75}
          metalness={0.12}
        />
      </mesh>

      {/* ── Facade Trim — top horizontal bar ─────────────────── */}
      <mesh position={[0, 4.85, 0.05]}>
        <boxGeometry args={[7.1, 0.18, 1.5]} />
        <meshStandardMaterial
          color="#2c2c38"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* ── Facade Trim — bottom bar ─────────────────────────── */}
      <mesh position={[0, -0.55, 0.05]}>
        <boxGeometry args={[7.1, 0.18, 1.5]} />
        <meshStandardMaterial
          color="#2c2c38"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* ── Left vertical trim ───────────────────────────────── */}
      <mesh position={[-3.45, 2.2, 0.05]}>
        <boxGeometry args={[0.18, 5.5, 1.52]} />
        <meshStandardMaterial color="#2c2c38" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* ── Right vertical trim ──────────────────────────────── */}
      <mesh position={[3.45, 2.2, 0.05]}>
        <boxGeometry args={[0.18, 5.5, 1.52]} />
        <meshStandardMaterial color="#2c2c38" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* ── Left Window Panel ────────────────────────────────── */}
      <mesh position={[-1.95, 2.6, 0.72]}>
        <boxGeometry args={[2.1, 3.2, 0.04]} />
        <meshPhysicalMaterial
          color="#001520"
          roughness={0.05}
          metalness={0.1}
          transmission={0.7}
          thickness={0.5}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── Right Window Panel ───────────────────────────────── */}
      <mesh position={[1.95, 2.6, 0.72]}>
        <boxGeometry args={[2.1, 3.2, 0.04]} />
        <meshPhysicalMaterial
          color="#001520"
          roughness={0.05}
          metalness={0.1}
          transmission={0.7}
          thickness={0.5}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── Window frame dividers ────────────────────────────── */}
      {[-1.95, 1.95].map((x, i) => (
        <mesh key={i} position={[x, 2.6, 0.73]}>
          <boxGeometry args={[0.06, 3.2, 0.06]} />
          <meshStandardMaterial color="#3a3a4a" metalness={0.8} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Roof Overhang ────────────────────────────────────── */}
      <mesh position={[0, 5.1, 0.5]} castShadow>
        <boxGeometry args={[7.4, 0.22, 2.2]} />
        <meshStandardMaterial
          color="#1c1c28"
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* ── Pavement / Ground slab ───────────────────────────── */}
      <mesh position={[0, -0.72, 1.5]} receiveShadow>
        <boxGeometry args={[9, 0.12, 5]} />
        <meshStandardMaterial
          color="#14141c"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* ── Side walls (depth) ───────────────────────────────── */}
      <mesh position={[-3.6, 2.2, -0.3]}>
        <boxGeometry args={[0.3, 5.5, 1.8]} />
        <meshStandardMaterial color="#15151e" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[3.6, 2.2, -0.3]}>
        <boxGeometry args={[0.3, 5.5, 1.8]} />
        <meshStandardMaterial color="#15151e" roughness={0.85} metalness={0.1} />
      </mesh>

    </group>
  );
}
