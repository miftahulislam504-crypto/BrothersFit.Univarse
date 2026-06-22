"use client";

import dynamic from "next/dynamic";
import { useUniverseStore } from "@/store/useUniverseStore";

/**
 * UniverseApp — সব Three.js + framer-motion + Zustand logic এখানে।
 *
 * এই component টা শুধুমাত্র browser-এ render হয় (ClientOnly + ssr:false)।
 * তাই framer-motion / Zustand এর SSR crash হওয়ার সুযোগ নেই।
 */

const LoadingScreen = dynamic(
  () => import("@/components/ui/LoadingScreen"),
  { ssr: false }
);

const CartDrawer = dynamic(
  () => import("@/components/ui/cart/CartDrawer"),
  { ssr: false }
);

const FlyToCartOverlay = dynamic(
  () => import("@/components/ui/cart/FlyToCartOverlay"),
  { ssr: false }
);

const ArrivalCanvas = dynamic(
  () => import("@/components/canvas/ArrivalCanvas"),
  { ssr: false }
);

const ExteriorCanvas = dynamic(
  () => import("@/components/canvas/ExteriorCanvas"),
  { ssr: false }
);

const MainHallCanvas = dynamic(
  () => import("@/components/canvas/MainHallCanvas"),
  { ssr: false }
);

const ProductDetailScene = dynamic(
  () => import("@/components/canvas/ProductDetailScene"),
  { ssr: false }
);

const CheckoutScene = dynamic(
  () => import("@/components/canvas/CheckoutScene"),
  { ssr: false }
);

const ComingNextPlaceholder = dynamic(
  () => import("@/components/ui/ComingNextPlaceholder"),
  { ssr: false }
);

export default function UniverseApp() {
  const scene = useUniverseStore((state) => state.scene);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-void">
      {/* Loading screen */}
      <LoadingScreen />

      {/* Phase 1: Cinematic arrival */}
      {scene === "arrival" && <ArrivalCanvas />}

      {/* Phase 2: Shop exterior */}
      {scene === "exterior" && <ExteriorCanvas />}

      {/* Phase 3+5: Main Hall */}
      {scene === "mainHall" && <MainHallCanvas />}

      {/* Phase 7: Product Details */}
      {scene === "productDetail" && <ProductDetailScene />}

      {/* Phase 9: Checkout */}
      {scene === "checkout" && <CheckoutScene />}

      {/* Upcoming scenes */}
      {scene !== "loading" &&
        scene !== "arrival" &&
        scene !== "exterior" &&
        scene !== "mainHall" &&
        scene !== "productDetail" &&
        scene !== "checkout" && <ComingNextPlaceholder />}

      {/* Global overlays */}
      <CartDrawer />
      <FlyToCartOverlay />
    </main>
  );
}
