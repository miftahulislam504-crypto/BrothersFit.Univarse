"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSafeTexture } from "@/hooks/useSafeTexture";

interface ProductPhotoFrameProps {
  /** product.imageUrl — null হলে এই component কিছুই render করবে না */
  imageUrl: string;
  /** Zone accent color — frame-এর emissive glow-এ ব্যবহার হয় */
  color: string;
  /** Pedestal-এর world position — photo frame সবসময় hall center-এর দিকে মুখ করার জন্য */
  worldPos: [number, number, number];
  hovered: boolean;
  isSelected: boolean;
  phaseOffset: number;
}

/**
 * Step 4 — Product Photo Frame।
 *
 * Octahedron hologram-এর জায়গায় এখন একটা real product photo, ফ্রেমসহ।
 *
 * কেন plane + texture, 3D cloth model না:
 *   Real cloth simulation হলো fashion industry-র সবচেয়ে কঠিন unsolved visual
 *   problem। ভালো-lighting-এ তোলা real product photo (transparent/white bg PNG)
 *   দেখতে অনেক বেশি "real" লাগে কারণ এটা আসলেই real। Reference Image 4
 *   (cardigan customizer) এই same approach ব্যবহার করে।
 *
 * কেন center-মুখী rotation:
 *   User সবসময় hall center [0,0,0] থেকে দেখে — photo frame center-এর
 *   দিকে মুখ করা থাকলে সব zone থেকেই সঠিকভাবে দেখা যায়।
 *   Formula: Math.atan2(-x, -z) → PlaneGeometry-র default +Z normal-কে
 *   origin-মুখী করে দেয়।
 *
 * Fallback:
 *   useSafeTexture → null হলে (404 বা pending) null রিটার্ন করে,
 *   ProductPedestal তখন octahedron দেখায়।
 */
export default function ProductPhotoFrame({
  imageUrl,
  color,
  worldPos,
  hovered,
  isSelected,
  phaseOffset,
}: ProductPhotoFrameProps) {
  // Center-এর দিকে মুখ করার angle:
  // PlaneGeometry default normal হলো +Z (0,0,1)।
  // Rotation Y = atan2(-x, -z) → normal টা origin-মুখী হয়।
  // উদা: [0,0,-10] → atan2(0,10)=0 (faces +Z → origin); [7,0,-6] → atan2(-7,6)≈-0.86
  const faceAngle = Math.atan2(-worldPos[0], -worldPos[2]);

  const productTex = useSafeTexture(imageUrl);

  // texture না পেলে null — ProductPedestal তখন octahedron দেখাবে
  if (!productTex) return null;

  return (
    <FrameInner
      faceAngle={faceAngle}
      color={color}
      productTex={productTex}
      hovered={hovered}
      isSelected={isSelected}
      phaseOffset={phaseOffset}
    />
  );
}

/**
 * Inner component — early return-এর পরে useFrame রাখতে হলে
 * আলাদা component-এ রাখতে হয় (React hooks rules)।
 */
function FrameInner({
  faceAngle,
  color,
  productTex,
  hovered,
  isSelected,
  phaseOffset,
}: {
  faceAngle: number;
  color: string;
  productTex: THREE.Texture;
  hovered: boolean;
  isSelected: boolean;
  phaseOffset: number;
}) {
  const frameRef = useRef<THREE.Group>(null!) as MutableRefObject<THREE.Group>;
  const photoRef = useRef<THREE.Mesh>(null!) as MutableRefObject<THREE.Mesh>;

  useFrame((state) => {
    const t = state.clock.elapsedTime + phaseOffset;

    if (frameRef.current) {
      // Gentle floating bob — octahedron-এর মতোই
      frameRef.current.position.y = 0.9 + Math.sin(t * 0.75) * 0.07;
      // Hover/select-এ slight scale up
      const targetScale = hovered || isSelected ? 1.08 : 1;
      const curr = frameRef.current.scale.x;
      frameRef.current.scale.setScalar(curr + (targetScale - curr) * 0.1);
    }

    if (photoRef.current) {
      const mat = photoRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        hovered || isSelected ? 0.18 : 0.06,
        0.08
      );
    }
  });

  // Photo dimension — portrait (2:3 ratio), জামা/কাপড়ের জন্য উপযুক্ত
  const W = 0.68;
  const H = 1.02;
  const BORDER = 0.045;

  return (
    <group ref={frameRef} rotation-y={faceAngle} position={[0, 0.9, 0]}>

      {/* Frame border — zone color emissive glow */}
      <mesh position={[0, 0, -0.008]}>
        <planeGeometry args={[W + BORDER * 2, H + BORDER * 2]} />
        <meshStandardMaterial
          color="#0c0c14"
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.55 : 0.22}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Product photo plane */}
      <mesh ref={photoRef} position={[0, 0, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          map={productTex}
          transparent
          alphaTest={0.05}
          roughness={0.55}
          metalness={0.05}
          emissive={color}
          emissiveIntensity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thin bottom stand rod */}
      <mesh position={[0, -(H / 2 + 0.06), 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
        <meshStandardMaterial color="#2a2a35" roughness={0.3} metalness={0.7} />
      </mesh>

    </group>
  );
}
