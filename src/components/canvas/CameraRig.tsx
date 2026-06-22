"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  /** true হলে camera forward rush শুরু হবে (scroll trigger হলে) */
  isMovingForward: boolean;
  onForwardComplete?: () => void;
}

/**
 * Cinematic camera controller।
 *
 * Idle state: subtle drift — mouse position দেখে আস্তে আস্তে X/Y-তে move করে,
 * যেন camera শ্বাস নিচ্ছে। Full mouse tracking না, শুধু gentle parallax।
 *
 * Forward state: Z-axis এ rapidly move করে, যেন door দিয়ে ঢুকছে।
 * Complete হলে callback fire করে scene switch করার জন্য।
 */
export default function CameraRig({
  isMovingForward,
  onForwardComplete,
}: CameraRigProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const forwardProgressRef = useRef(0);
  const hasFiredCallback = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (isMovingForward) {
      // Forward rush — exponential speed তারপর ease-out
      forwardProgressRef.current = Math.min(
        forwardProgressRef.current + delta * 0.9,
        1
      );
      const t = forwardProgressRef.current;
      // Ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      camera.position.z = THREE.MathUtils.lerp(0, -12, eased);

      if (t >= 0.98 && !hasFiredCallback.current) {
        hasFiredCallback.current = true;
        onForwardComplete?.();
      }
      return;
    }

    // Idle cinematic drift
    const time = performance.now() * 0.001;

    // Gentle breath-like Y movement
    const breathY = Math.sin(time * 0.4) * 0.06;
    // Mouse parallax (very subtle)
    const targetX = mouseRef.current.x * 0.15;
    const targetY = mouseRef.current.y * 0.08 + breathY;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 0, 0.05);

    // Always look slightly toward center
    camera.lookAt(0, 0, -3);
  });

  return null;
}
