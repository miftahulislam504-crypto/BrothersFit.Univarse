"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hall-এর ভেতরের ambient dust — exterior rain/particle থেকে আলাদা,
 * এখানে অনেক subtle, ধীরগতির, আলোর রশ্মিতে ভাসমান ধুলোর মতো।
 */
export default function HallDust({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = Math.random() * 6 - 1.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36;

      speeds[i] = 0.1 + Math.random() * 0.25;
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
    if (!geometryRef.current) return;
    const t = state.clock.elapsedTime;
    const attr = geometryRef.current.attributes.position as THREE.BufferAttribute;
    if (!attr) return;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += Math.sin(t * speeds[i] + offsets[i]) * 0.0006;
      arr[i3] += Math.cos(t * speeds[i] * 0.6 + offsets[i]) * 0.0004;
    }

    attr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.006;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.025}
        color="#f2efe9"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
