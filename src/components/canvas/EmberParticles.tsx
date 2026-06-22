"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EmberParticles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds    = new Float32Array(count);
    const offsets   = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      speeds[i]  = 0.3 + Math.random() * 0.8;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, [count]);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current || !geometryRef.current) return;
    const time = state.clock.elapsedTime;
    const attr = geometryRef.current.attributes.position as THREE.BufferAttribute;
    if (!attr) return;
    const posArray = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += speeds[i] * 0.0025;
      posArray[i3]     += Math.sin(time * speeds[i] + offsets[i]) * 0.0012;
      if (posArray[i3 + 1] > 5) {
        posArray[i3 + 1] = -4;
        posArray[i3]     = (Math.random() - 0.5) * 10;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.07}
        color="#ff3d1a"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
