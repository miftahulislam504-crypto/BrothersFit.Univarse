"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ProductStudioProps {
  accentHex: string;
}

/**
 * Product Detail-এর জন্য studio-style lighting + ambient backdrop।
 * Main Hall-এর dramatic neon lighting থেকে আলাদা — এখানে product
 * clearly দেখানোই priority, তাই softer key/fill light setup।
 */
export default function ProductStudio({ accentHex }: ProductStudioProps) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.elapsedTime;
      ringRef.current.rotation.z = t * 0.04;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <group>
      {/* Soft ambient base */}
      <ambientLight intensity={0.5} color="#1a1a24" />

      {/* Key light — front-top, neutral white */}
      <directionalLight position={[2, 3, 3]} intensity={0.9} color="#f2efe9" />

      {/* Fill light — opposite side, softer */}
      <directionalLight position={[-2, 1, -2]} intensity={0.3} color="#8a8a99" />

      {/* Rim light — accent color, separates subject from background */}
      <pointLight position={[0, 1.5, -2]} intensity={1.2} color={accentHex} distance={6} />

      {/* Floor disc — subtle reflective surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]} receiveShadow>
        <circleGeometry args={[3, 48]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Decorative backdrop ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <ringGeometry args={[1.4, 1.46, 64]} />
        <meshBasicMaterial color={accentHex} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
