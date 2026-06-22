"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import Product360Viewer from "./Product360Viewer";
import ProductStudio from "./ProductStudio";

interface ProductViewerCanvasProps {
  colorHex: string;
  accentHex: string;
  isMobile: boolean;
}

/**
 * 360° viewer-এর জন্য নিজস্ব ছোট Canvas — Main Hall-এর full-screen Canvas
 * থেকে আলাদা, কারণ এখানে শুধু viewport-এর একটা অংশ (left/top half) জুড়ে
 * product দেখানো হবে, বাকিটা 2D info panel।
 */
export default function ProductViewerCanvas({
  colorHex,
  accentHex,
  isMobile,
}: ProductViewerCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 2.6], fov: 42, near: 0.1, far: 20 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? "default" : "high-performance",
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows
    >
      <Suspense fallback={null}>
        <ProductStudio accentHex={accentHex} />
        <Product360Viewer colorHex={colorHex} accentHex={accentHex} />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
