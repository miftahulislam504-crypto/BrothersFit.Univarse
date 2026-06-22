"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  forwardSpeed?: number;
  dissolving?: boolean;
}

/**
 * GPU-based particle system — single draw call, mobile-safe।
 * Imperative setAttribute ব্যবহার করা হচ্ছে কারণ এটা
 * React Three Fiber সব version-এ reliably কাজ করে।
 */
export default function ParticleField({
  count = 1200,
  forwardSpeed = 0,
  dissolving = false,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 5;

      speeds[i]  = 0.2 + Math.random() * 0.6;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, [count]);

  // Imperatively set the buffer attribute — most compatible with R3F versions
  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current || !geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const attr = geometryRef.current.attributes.position as THREE.BufferAttribute;
    if (!attr) return;
    const posArray = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * speeds[i] + offsets[i]) * 0.0008;

      if (forwardSpeed > 0) {
        posArray[i3 + 2] += forwardSpeed * 0.016;
        if (posArray[i3 + 2] > 6) {
          posArray[i3 + 2] = -18;
        }
      }
    }

    attr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.018;
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.04;

    if (dissolving && materialRef.current.opacity > 0) {
      materialRef.current.opacity = Math.max(0, materialRef.current.opacity - 0.012);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        ref={materialRef}
        size={0.045}
        color="#f2efe9"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
