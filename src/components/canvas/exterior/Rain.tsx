"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RainProps {
  count?: number;
  /** mobile-এ rain কমিয়ে দিতে */
  intensity?: number;
}

/**
 * Rain Effect — ছোট vertical line segment হিসেবে।
 * প্রতিটা raindrop আলাদা mesh না — সব একটাই BufferGeometry-তে।
 * প্রতিটা rain segment = 2 vertices (top + bottom of the streak)।
 */
export default function Rain({ count = 600, intensity = 1 }: RainProps) {
  const linesRef   = useRef<THREE.LineSegments>(null!);
  const geometryRef = useRef<THREE.BufferGeometry>(null!);

  const actualCount = Math.floor(count * intensity);

  const { positions, speeds, originalY } = useMemo(() => {
    // Each rain streak = 2 points: top and bottom
    const positions = new Float32Array(actualCount * 6); // 2 vertices * 3 coords
    const speeds    = new Float32Array(actualCount);
    const originalY = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 14 + 4;
      const z = (Math.random() - 0.5) * 12 - 6;
      const len = 0.12 + Math.random() * 0.22; // streak length

      const i6 = i * 6;
      positions[i6]     = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;
      positions[i6 + 3] = x;
      positions[i6 + 4] = y - len;
      positions[i6 + 5] = z;

      speeds[i]    = 4 + Math.random() * 6;
      originalY[i] = y;
    }

    return { positions, speeds, originalY };
  }, [actualCount]);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.slice(), 3)
    );
  }, [positions]);

  useFrame((_, delta) => {
    if (!geometryRef.current) return;
    const attr = geometryRef.current.attributes.position as THREE.BufferAttribute;
    if (!attr) return;
    const posArray = attr.array as Float32Array;

    for (let i = 0; i < actualCount; i++) {
      const i6 = i * 6;
      const fall = speeds[i] * delta;

      posArray[i6 + 1] -= fall; // top vertex Y
      posArray[i6 + 4] -= fall; // bottom vertex Y

      // Respawn above when fallen past ground
      if (posArray[i6 + 1] < -5) {
        const resetY = originalY[i] + 8;
        posArray[i6 + 1] = resetY;
        posArray[i6 + 4] = resetY - (0.12 + Math.random() * 0.22);
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial
        color="#8ab4cc"
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </lineSegments>
  );
}
