"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PedestalProduct } from "@/lib/placeholderProducts";
import ProductPhotoFrame from "./ProductPhotoFrame";

interface ProductPedestalProps {
  position: [number, number, number];
  color: string;
  product: PedestalProduct;
  /** Floating animation-এর জন্য individual phase offset */
  phaseOffset?: number;
  /** true হলে এই pedestal বর্তমানে selected/zoomed অবস্থায় আছে */
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * Product Pedestal — প্রতিটা product zone-এর কেন্দ্রবিন্দু।
 *
 * Step 4 update:
 *   - product.imageUrl-এ PNG থাকলে → ProductPhotoFrame (real product photo,
 *     ফ্রেমসহ, center-মুখী, bob animation)
 *   - imageUrl না থাকলে বা ফাইল না পেলে → octahedron hologram fallback
 *     (আগের মতোই, crash নেই)
 *
 * Phase 6 থেকে: hover করলে price/rating card ভেসে ওঠে (Html overlay),
 * click করলে parent camera zoom-in animation trigger করে।
 */
export default function ProductPedestal({
  position,
  color,
  product,
  phaseOffset = 0,
  isSelected = false,
  onSelect,
}: ProductPedestalProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const hologramRef = useRef<THREE.Mesh>(null!);
  const baseGlowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phaseOffset;

    // Floating hologram placeholder — gentle rotation + bob
    if (hologramRef.current) {
      hologramRef.current.rotation.y = t * 0.4;
      hologramRef.current.position.y = 0.9 + Math.sin(t * 0.8) * 0.08;

      const targetScale = hovered || isSelected ? 1.12 : 1;
      hologramRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      const mat = hologramRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        hovered || isSelected ? 0.9 : 0.45 + Math.sin(t * 1.2) * 0.1;
    }

    // Base glow pulses, intensifies on hover/select
    if (baseGlowRef.current) {
      const mat = baseGlowRef.current.material as THREE.MeshBasicMaterial;
      const target = hovered || isSelected ? 0.6 : 0.28;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, 0.08);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Pedestal base — cylinder */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.7, 24]} />
        <meshStandardMaterial color="#1c1c26" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Pedestal top disc */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.06, 24]} />
        <meshStandardMaterial color="#2c2c38" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Base glow ring on the floor */}
      <mesh
        ref={baseGlowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.34, 0]}
      >
        <ringGeometry args={[0.5, 0.95, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>

      {/* Step 4: real product photo অথবা octahedron hologram ────────
          product.imageUrl থাকলে → ProductPhotoFrame চেষ্টা করে।
            texture load হলে → photo frame দেখাবে।
            texture 404 হলে → PhotoFrame null দেয়, space ফাঁকা থাকে
              (pedestal base + glow ring তখনও দেখা যায়, site ভাঙে না)।
          product.imageUrl না থাকলে → octahedron সরাসরি।            ── */}
      {product.imageUrl ? (
        <ProductPhotoFrame
          imageUrl={product.imageUrl}
          color={color}
          worldPos={position}
          hovered={hovered}
          isSelected={isSelected}
          phaseOffset={phaseOffset}
        />
      ) : (
        <>
          <mesh ref={hologramRef} position={[0, 0.9, 0]}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={color} emissive={color} emissiveIntensity={0.45}
              roughness={0.15} metalness={0.3} transparent opacity={0.85}
            />
          </mesh>
          <mesh position={[0, 0.9, 0]} scale={1.35}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshBasicMaterial color={color} wireframe transparent
              opacity={hovered || isSelected ? 0.5 : 0.2} />
          </mesh>
        </>
      )}

      {/* Spotlight on the pedestal — আগে এই light সব সময় (২১টা pedestal-এ
          ২১টা) চলতো, এখন শুধু hover/select হলে mount হয়। বাকি সময়
          octahedron-এর emissive material + নিচের glow ring (দুটোই
          self-lit meshBasicMaterial/emissive, external light লাগে না)
          দিয়েই উজ্জ্বল দেখায় — visual loss কম, GPU lighting cost অনেক কম। */}
      {(hovered || isSelected) && (
        <pointLight
          position={[0, 1.6, 0.3]}
          color={color}
          intensity={1.4}
          distance={3.5}
          decay={2}
        />
      )}

      {/* Hover info card — price + rating, fades in on hover */}
      {hovered && !isSelected && (
        <Html position={[0, 1.65, 0]} center distanceFactor={8} occlude={false}>
          <div
            className="pointer-events-none flex flex-col items-center gap-0.5 whitespace-nowrap rounded-xl border px-3 py-2 backdrop-blur-md transition-opacity duration-200"
            style={{
              borderColor: `${color}40`,
              backgroundColor: "rgba(13,13,20,0.7)",
            }}
          >
            <p className="font-display text-xs font-bold text-bone">
              {product.name}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px]" style={{ color }}>
                ৳{product.price}
              </span>
              <span className="font-mono text-[9px] text-smoke">
                ★ {product.rating}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
