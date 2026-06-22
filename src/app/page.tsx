"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUniverseStore } from "@/store/useUniverseStore";

/**
 * Three.js Canvas components — SSR disabled (browser-only WebGL API)।
 * dynamic import + ssr:false না করলে Next.js build-এ
 * "window is not defined" error আসে। CheckoutScene-এ কোনো Three.js
 * নেই, কিন্তু consistency আর code-splitting-এর জন্য একই pattern রাখা হলো।
 *
 * FIX: LoadingScreen, CartDrawer, FlyToCartOverlay — এগুলো framer-motion
 * ব্যবহার করে। Next.js 15-এ framer-motion এর internal React batch config
 * SSR pass-এ crash করে ("ReactCurrentBatchConfig" TypeError)।
 * তাই এগুলোকেও ssr:false দিয়ে dynamic import করা হলো।
 */

// ── Framer-motion components (SSR crash fix) ──────────────────────────────
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

// ── Three.js Canvas components ────────────────────────────────────────────
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

export default function Home() {
  const scene = useUniverseStore((state) => state.scene);

  // এই পুরো page পুরোপুরি client-side animation + Three.js নির্ভর — SSR-এর
  // কোনো value নেই, কিন্তু "use client" component-ও by default server-এ
  // একবার render হয় (hydration-এর জন্য)। সেই server-render pass-এ
  // framer-motion/zustand-এর সাথে client bundle-এর mismatch হলে
  // "ReactCurrentBatchConfig" জাতীয় crash হতে পারে। তাই mount হওয়ার
  // আগ পর্যন্ত কিছুই render না করে, পুরো tree-টা client-only রাখা হলো।
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <main className="h-screen w-full bg-void" />;
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-void">
      {/* Loading screen — AnimatePresence দিয়ে নিজেই exit করে */}
      <LoadingScreen />

      {/* Phase 1: Cinematic arrival */}
      {scene === "arrival" && <ArrivalCanvas />}

      {/* Phase 2: Shop exterior + door animation */}
      {scene === "exterior" && <ExteriorCanvas />}

      {/* Phase 3 + 5: Main Hall 3D Interior + Navigation Layer */}
      {scene === "mainHall" && <MainHallCanvas />}

      {/* Phase 7: Product Details Universe */}
      {scene === "productDetail" && <ProductDetailScene />}

      {/* Phase 9: Checkout Flow */}
      {scene === "checkout" && <CheckoutScene />}

      {/* বাকি scene — পরের ধাপে বানানো হবে */}
      {scene !== "loading" &&
        scene !== "arrival" &&
        scene !== "exterior" &&
        scene !== "mainHall" &&
        scene !== "productDetail" &&
        scene !== "checkout" && <ComingNextPlaceholder />}

      {/* Phase 8: Cart Drawer + Fly-to-Cart animation — সব scene-এর উপরে
          global overlay হিসেবে বসানো, যাতে যেকোনো scene থেকে cart খোলা যায়
          এবং animation সঠিক cart icon target খুঁজে পায়। */}
      <CartDrawer />
      <FlyToCartOverlay />
    </main>
  );
}
