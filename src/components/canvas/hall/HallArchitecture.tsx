"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SafeAsset } from "../SafeAsset";

interface HallArchitectureProps {
  isMobile?: boolean;
}

/**
 * Step 3 — Real Architecture Layer।
 *
 * আগে boundary wall ছিল একটামাত্র plain cylinder — পুরোপুরি ফাঁকা, কোনো
 * rhythm/structure ছিল না। এখানে যোগ হলো চারটা জিনিস:
 *
 *   ১) ৮টা vertical pillar, সমান দূরত্বে circle-এ বসানো (radius 19)।
 *   ২) ৪টা polished "mirror-accent" wall arc (radius 20.5, পুরোনো
 *      boundary wall-এর ভেতরে, কোনো সংঘর্ষ নেই)। এগুলো curved surface,
 *      তাই drei-র MeshReflectorMaterial ব্যবহার করা হয়নি — ওটা শুধু
 *      flat plane-এর জন্য সঠিকভাবে কাজ করে (single reflection-camera
 *      একটা plane ধরে নিয়ে হিসাব করে); curved geometry-তে বসালে
 *      reflection ভুল/বিকৃত দেখাতো। তার বদলে high-metalness/low-roughness
 *      meshPhysicalMaterial + Step 2-এর HDRI environment map ব্যবহার
 *      করা হয়েছে, যেটা যেকোনো shape-এ সঠিকভাবে কাজ করে।
 *   ৩) ২টা glass display case — খালি furniture, ভেতরে Step 4-এ আসল
 *      product (real photo) বসবে। true glass transmission ব্যবহার করা
 *      হয়নি ইচ্ছাকৃতভাবে — সেটা mobile GPU-তে একটা আলাদা ভারী render
 *      pass লাগে, তার বদলে simple transparent material দিয়ে সস্তায়
 *      কাছাকাছি look আনা হয়েছে।
 *   ৪) Step 3.5: ২টা optional real coat-rack .glb model — public/models/
 *      coat-rack.glb রাখা থাকলে এখানে দেখা যাবে, না থাকলে SafeAsset
 *      চুপচাপ কিছুই render করবে না (crash না করে)। scale=1 default,
 *      আসল model দেখার পর হয়তো scale/position fine-tune লাগতে পারে,
 *      কারণ Sketchfab model-এর আসল unit/pivot আগে থেকে জানা সম্ভব না।
 *
 * Pillar/mirror/case পুরোপুরি procedural — zip deploy করলেই কাজ করবে।
 * শুধু rack model-টা optional, real asset লাগে।
 */
function CoatRackModel({ position }: { position: [number, number, number] }) {
  // Sketchfab glTF format-এ download হয়েছে — single .glb না।
  // folder: public/models/coat-rack.glb/scene.gltf + scene.bin + textures/
  // Next.js public/ থেকে এই path সঠিকভাবে serve হয়,
  // scene.bin আর textures/ আপনা-আপনি relative path-এ resolve হয়।
  const { scene } = useGLTF("/models/coat-rack.glb/scene.gltf");
  return <primitive object={scene.clone()} position={position} scale={1} />;
}

export default function HallArchitecture({ isMobile = false }: HallArchitectureProps) {
  const pillarCount = 8;
  const pillarRadius = 19;
  const wallY = 2.2;
  const wallHeight = 7.8;
  const segments = isMobile ? 20 : 32;

  // ৪টা mirror-accent arc, সমান ব্যবধানে — exact zone-angle-এর সাথে মিলানো
  // হয়নি ইচ্ছাকৃতভাবে, কারণ এগুলো purely atmospheric/rhythm element,
  // কোনো নির্দিষ্ট zone-এর সাথে bound না।
  const mirrorArcs = [
    { startDeg: 15, lengthDeg: 28 },
    { startDeg: 105, lengthDeg: 28 },
    { startDeg: 195, lengthDeg: 28 },
    { startDeg: 285, lengthDeg: 28 },
  ];

  const caseSpots: [number, number, number][] = [
    [11, -0.9, -11],
    [-11, -0.9, 11],
  ];

  // optional coat-rack model spot — zone(~radius 9), glass case(~radius
  // 15.6), pillar(radius 19) — সবকিছু থেকে আলাদা angle/radius-এ রাখা
  const rackSpots: [number, number, number][] = [
    [15, -1.6, -4],
    [-15, -1.6, 4],
  ];

  return (
    <group>
      {/* ── Pillars ───────────────────────────────────────────── */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const theta = (i / pillarCount) * Math.PI * 2;
        const x = pillarRadius * Math.sin(theta);
        const z = -pillarRadius * Math.cos(theta);
        return (
          <mesh key={`pillar-${i}`} position={[x, wallY, z]}>
            <cylinderGeometry args={[0.22, 0.26, wallHeight, 16]} />
            <meshStandardMaterial
              color="#1c1c24"
              roughness={0.45}
              metalness={0.5}
              envMapIntensity={1}
            />
          </mesh>
        );
      })}

      {/* ── Mirror-accent wall arcs — curved, তাই MeshReflectorMaterial
          না, environment-mapped polished material ──────────────── */}
      {mirrorArcs.map((arc, i) => (
        <mesh key={`mirror-${i}`} position={[0, wallY, 0]}>
          <cylinderGeometry
            args={[
              20.5,
              20.5,
              wallHeight,
              segments,
              1,
              true,
              (arc.startDeg * Math.PI) / 180,
              (arc.lengthDeg * Math.PI) / 180,
            ]}
          />
          <meshPhysicalMaterial
            color="#101014"
            roughness={0.08}
            metalness={0.95}
            envMapIntensity={2}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* ── Glass display case — খালি, Step 4-এ product বসবে ───── */}
      {caseSpots.map((pos, i) => (
        <group key={`case-${i}`} position={pos}>
          {/* Base/plinth */}
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[1.6, 0.7, 1.0]} />
            <meshStandardMaterial
              color="#15151c"
              roughness={0.3}
              metalness={0.55}
              envMapIntensity={1}
            />
          </mesh>

          {/* Glass top — সস্তা approximation, true transmission না
              (mobile GPU-তে transmission pass ভারী, তাই এড়ানো হলো) */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[1.5, 1.2, 0.9]} />
            <meshStandardMaterial
              color="#bcd8e0"
              transparent
              opacity={0.18}
              roughness={0.05}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* চারটা vertical corner rod — vitrine-এর কাঠামো বোঝাতে */}
          {(
            [
              [0.72, 0.55, 0.42],
              [-0.72, 0.55, 0.42],
              [0.72, 0.55, -0.42],
              [-0.72, 0.55, -0.42],
            ] as [number, number, number][]
          ).map((cornerPos, ci) => (
            <mesh key={ci} position={cornerPos}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
              <meshStandardMaterial color="#3a3a44" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Optional real coat-rack model — public/models/coat-rack.glb
          রাখা থাকলে দেখা যাবে, না থাকলে কিছুই render হবে না (silent,
          crash না করে) ───────────────────────────────────────── */}
      {rackSpots.map((pos, i) => (
        <SafeAsset key={`rack-${i}`} fallback={null}>
          <Suspense fallback={null}>
            <CoatRackModel position={pos} />
          </Suspense>
        </SafeAsset>
      ))}
    </group>
  );
}
