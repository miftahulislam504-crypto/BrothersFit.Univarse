"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HallCameraRigProps {
  /** Active zone-এর angle (degrees), null হলে free orbit */
  targetAngle: number | null;
  /** নির্বাচিত pedestal-এর world position — দেওয়া থাকলে camera zoom-in করে */
  zoomTarget: [number, number, number] | null;
  onAngleChange?: (angle: number) => void;
  /** zoom animation সম্পূর্ণ হলে fire হয় */
  onZoomComplete?: () => void;
}

/**
 * Main Hall Camera — center-এ দাঁড়িয়ে চারপাশে ঘোরে, অনেকটা boutique
 * gallery বা showroom-এর মতো। তিনটা mode:
 *
 * 1. Free drag: user mouse/touch দিয়ে drag করলে camera orbit করে
 * 2. Auto-focus: কোনো zone click করলে camera smoothly সেই angle-এ rotate করে
 * 3. Zoom-in (Phase 6): pedestal click করলে camera সেই pedestal-এর দিকে
 *    তাকিয়ে FOV narrow করে (dolly zoom feel), তারপর onZoomComplete() fire করে
 */
export default function HallCameraRig({
  targetAngle,
  zoomTarget,
  onAngleChange,
  onZoomComplete,
}: HallCameraRigProps) {
  const { camera, gl } = useThree();
  const perspCamera = camera as THREE.PerspectiveCamera;

  const currentAngleRef = useRef(0);
  const dragAngleVelocity = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerX = useRef(0);
  const heightBob = useRef(0);

  const zoomProgressRef = useRef(0);
  const hasFiredZoomComplete = useRef(false);
  const baseFov = 72;
  const zoomedFov = 38;

  useEffect(() => {
    camera.position.set(0, 0.6, 0);
  }, [camera]);

  // Zoom শুরু/বন্ধ হলে progress আর fired flag reset
  useEffect(() => {
    zoomProgressRef.current = 0;
    hasFiredZoomComplete.current = false;
  }, [zoomTarget]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (zoomTarget) return; // zoom অবস্থায় drag বন্ধ
      isDraggingRef.current = true;
      lastPointerX.current = e.clientX;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      dragAngleVelocity.current = -deltaX * 0.25;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
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
  }, [gl, zoomTarget]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // ── Zoom-in mode ──────────────────────────────────────────
    if (zoomTarget) {
      zoomProgressRef.current = Math.min(zoomProgressRef.current + delta * 0.9, 1);
      const eased = 1 - Math.pow(1 - zoomProgressRef.current, 3); // ease-out cubic

      // FOV narrows — dolly zoom feel
      perspCamera.fov = THREE.MathUtils.lerp(baseFov, zoomedFov, eased);
      perspCamera.updateProjectionMatrix();

      // Camera looks directly at the selected pedestal
      const lookTarget = new THREE.Vector3(...zoomTarget);
      const currentLook = new THREE.Vector3(
        Math.sin(currentAngleRef.current) * 10,
        0.8,
        -Math.cos(currentAngleRef.current) * 10
      );
      currentLook.lerp(lookTarget, eased);
      camera.lookAt(currentLook);

      if (zoomProgressRef.current >= 0.98 && !hasFiredZoomComplete.current) {
        hasFiredZoomComplete.current = true;
        onZoomComplete?.();
      }
      return;
    }

    // ── Reset FOV smoothly when not zooming ──────────────────
    if (perspCamera.fov !== baseFov) {
      perspCamera.fov = THREE.MathUtils.lerp(perspCamera.fov, baseFov, 0.1);
      perspCamera.updateProjectionMatrix();
    }

    // ── Normal orbit mode ─────────────────────────────────────
    if (Math.abs(dragAngleVelocity.current) > 0.001) {
      currentAngleRef.current += dragAngleVelocity.current;
      dragAngleVelocity.current *= 0.85;
    }

    if (targetAngle !== null && !isDraggingRef.current) {
      const targetRad = THREE.MathUtils.degToRad(targetAngle);
      let diff = targetRad - currentAngleRef.current;
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      currentAngleRef.current += diff * Math.min(delta * 2.2, 0.1);
    }

    heightBob.current = Math.sin(t * 0.5) * 0.03;
    camera.position.set(0, 0.6 + heightBob.current, 0);

    const lookX = Math.sin(currentAngleRef.current) * 10;
    const lookZ = -Math.cos(currentAngleRef.current) * 10;
    camera.lookAt(lookX, 0.8, lookZ);

    onAngleChange?.(THREE.MathUtils.radToDeg(currentAngleRef.current));
  });

  return null;
}
