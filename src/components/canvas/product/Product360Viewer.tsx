"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Product360ViewerProps {
  /** Selected color hex — placeholder shape-এর গায়ে apply হয় */
  colorHex: string;
  accentHex: string;
}

/**
 * 360° Product Viewer — drag করে product ঘোরানো যায়।
 *
 * এখনো real garment 3D model নেই (সেটা আসল product photography/3D scan
 * লাগবে, যেটা এই ধাপে নেই) — তাই একটা stylized hologram-like placeholder
 * shape ব্যবহার হচ্ছে যেটা t-shirt silhouette-এর ইঙ্গিত দেয় (torso + sleeve
 * geometry)। Color switch করলে এই শেপের material color বদলায়, আর drag
 * করলে rotate হয় — যেটা real model বসানোর পর একই ইন্টারঅ্যাকশন pattern
 * বজায় রাখবে।
 */
export default function Product360Viewer({
  colorHex,
  accentHex,
}: Product360ViewerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { gl } = useThree();

  const rotationY = useRef(0);
  const rotationVelocity = useRef(0.25); // স্বয়ংক্রিয় ধীর ঘূর্ণন, drag করলে override
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPointerX.current = e.clientX;
      setAutoRotate(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      rotationVelocity.current = deltaX * 0.012;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      // কিছুক্ষণ পর আবার auto-rotate চালু — user-কে hint দেয় যে drag করা যায়
      setTimeout(() => setAutoRotate(true), 2200);
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isDragging.current) {
      rotationY.current += rotationVelocity.current;
    } else if (autoRotate) {
      rotationY.current += delta * 0.35;
    } else {
      // Drag ছাড়ার পরের momentum, friction দিয়ে কমে যায়
      rotationVelocity.current *= 0.92;
      rotationY.current += rotationVelocity.current;
    }

    groupRef.current.rotation.y = rotationY.current;

    // Gentle float
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Torso — main body shape */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.55, 0.9, 8, 16]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* Collar ring */}
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.05, 12, 24]} />
        <meshStandardMaterial color={colorHex} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.62, 0.35, 0]} rotation={[0, 0, 0.45]}>
        <capsuleGeometry args={[0.16, 0.55, 6, 12]} />
        <meshStandardMaterial color={colorHex} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.62, 0.35, 0]} rotation={[0, 0, -0.45]}>
        <capsuleGeometry args={[0.16, 0.55, 6, 12]} />
        <meshStandardMaterial color={colorHex} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Brand accent stripe — accent color, signature BrotherFit touch */}
      <mesh position={[0, -0.05, 0.5]}>
        <boxGeometry args={[0.32, 0.05, 0.02]} />
        <meshStandardMaterial
          color={accentHex}
          emissive={accentHex}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Ground contact shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Rim light accent */}
      <pointLight position={[1.2, 0.6, 1]} intensity={0.6} color={accentHex} distance={4} />
      <pointLight position={[-1.2, 0.3, -0.8]} intensity={0.3} color="#ffffff" distance={4} />
    </group>
  );
}
