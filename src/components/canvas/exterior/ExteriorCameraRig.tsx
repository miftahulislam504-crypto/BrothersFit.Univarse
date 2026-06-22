"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ExteriorCameraRigProps {
  /** 0–1: door opening progress (also drives camera position) */
  scrollProgress: number;
  onEntryComplete: () => void;
}

/**
 * Exterior Camera — তিনটি phase:
 *
 * Phase A (scrollProgress 0–0.4): idle — camera street level-এ দাঁড়িয়ে,
 *   mouse দেখে subtle parallax। Building টা সামনে।
 *
 * Phase B (scrollProgress 0.4–0.8): camera ধীরে door-এর দিকে এগোয়,
 *   door-এর ভেতরের glow visible হয়।
 *
 * Phase C (scrollProgress 0.8–1.0): camera rush — দরজা পার হয়ে ভেতরে ঢোকে।
 *   onEntryComplete() callback → scene = "mainHall"
 */
export default function ExteriorCameraRig({
  scrollProgress,
  onEntryComplete,
}: ExteriorCameraRigProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasFiredRef = useRef(false);
  const currentPosRef = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    // Starting position: street level, facing the shop
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0.5, -8);
  }, [camera]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame((_, delta) => {
    const p = scrollProgress;

    let targetX = mouseRef.current.x * 0.18;
    let targetY = 0;
    let targetZ = 4;
    const lookTarget = new THREE.Vector3(0, 0.5, -8);

    if (p <= 0.4) {
      // Phase A: idle with mouse parallax
      targetY = mouseRef.current.y * 0.08;
      targetZ = 4;
    } else if (p <= 0.8) {
      // Phase B: walk toward door
      const t = (p - 0.4) / 0.4; // 0→1
      targetZ = THREE.MathUtils.lerp(4, 0.2, t);
      targetX = mouseRef.current.x * THREE.MathUtils.lerp(0.18, 0.05, t);
      lookTarget.set(0, 0.3, THREE.MathUtils.lerp(-8, -8.5, t));
    } else {
      // Phase C: rush through door
      const t = (p - 0.8) / 0.2; // 0→1
      const eased = 1 - Math.pow(1 - t, 3); // ease in cubic
      targetZ = THREE.MathUtils.lerp(0.2, -9.5, eased);
      targetX = 0;
      targetY = THREE.MathUtils.lerp(0, 0.1, eased);
      lookTarget.set(0, 0.3, THREE.MathUtils.lerp(-8.5, -18, eased));

      if (eased >= 0.95 && !hasFiredRef.current) {
        hasFiredRef.current = true;
        onEntryComplete();
      }
    }

    // Smooth lerp to target
    const lerpSpeed = p > 0.8 ? 0.12 : 0.05;
    currentPosRef.current.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      lerpSpeed
    );

    camera.position.copy(currentPosRef.current);
    camera.lookAt(lookTarget);
  });

  return null;
}
