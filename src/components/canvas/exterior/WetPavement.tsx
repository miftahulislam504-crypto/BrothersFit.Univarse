"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

interface WetPavementProps {
  isMobile?: boolean;
}

/**
 * Wet pavement — Step 5 upgrade।
 *
 * আগে: meshStandardMaterial + high metalness = fake reflection approximation।
 *   → HDRI বদলালে কিছু পরিবর্তন হতো না, কারণ metalness fake mirror দেয়,
 *     real environment IBL pick করে না এভাবে।
 *
 * এখন: MeshReflectorMaterial — MainHall-এর floor-এর মতো same approach,
 *   কিন্তু exterior mood-এ tuned:
 *   - mixStrength কম (MainHall-এর 28/45 vs এখানে 15/28) — বৃষ্টির মেঝে
 *     পুরোপুরি mirror না, partially wet
 *   - blur বেশি — wet concrete-এ reflection blurry হয়, polished marble-এ না
 *   - color dark (#0e0e18) — রাতের রাস্তার রঙ
 *
 * Puddle আর tile meshগুলো আগের মতোই — ওগুলো procedural emissive, ভালো কাজ করছিল।
 */
export default function WetPavement({ isMobile = false }: WetPavementProps) {
  const puddle1Ref = useRef<THREE.Mesh>(null!);
  const puddle2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (puddle1Ref.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.04;
      puddle1Ref.current.scale.set(s, 1, s);
      const mat = puddle1Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 1.2) * 0.15;
    }
    if (puddle2Ref.current) {
      const s = 1 + Math.sin(t * 0.9 + 1) * 0.03;
      puddle2Ref.current.scale.set(s, 1, s);
      const mat = puddle2Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(t * 0.9 + 1) * 0.1;
    }
  });

  return (
    <group>
      {/* Main ground plane — Step 5: MeshReflectorMaterial */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.0, -6]}
        receiveShadow
      >
        <planeGeometry args={[30, 20]} />
        <MeshReflectorMaterial
          resolution={isMobile ? 256 : 512}
          blur={isMobile ? [300, 100] : [500, 150]}
          mixBlur={0.9}
          mixStrength={isMobile ? 15 : 28}
          mirror={0}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0e0e18"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Puddle 1 — ember reflection near door (আগের মতোই) */}
      <mesh
        ref={puddle1Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.4, -2.98, -6.8]}
      >
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial
          color="#1a0800"
          roughness={0.02}
          metalness={0.9}
          emissive="#ff3d1a"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Puddle 2 — cyan reflection left of door (আগের মতোই) */}
      <mesh
        ref={puddle2Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-1.2, -2.98, -6.5]}
      >
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          color="#001a20"
          roughness={0.02}
          metalness={0.9}
          emissive="#00f0ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Pavement tile grid — concrete texture hint (আগের মতোই) */}
      {[-4, -2, 0, 2, 4].map((x) =>
        [-4, -2, 0, 2, 4, 6].map((z) => (
          <mesh
            key={`${x}-${z}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, -2.99, z - 8]}
          >
            <planeGeometry args={[1.98, 1.98]} />
            <meshStandardMaterial
              color="#16161f"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        ))
      )}
    </group>
  );
}
