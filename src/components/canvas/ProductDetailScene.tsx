"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useUniverseStore } from "@/store/useUniverseStore";
import { getProductDetail, ColorOption } from "@/lib/productDetail";
import { getPlaceholderProduct } from "@/lib/placeholderProducts";
import ColorSwitch from "@/components/ui/product/ColorSwitch";
import SizeSelector from "@/components/ui/product/SizeSelector";
import MaterialInfo from "@/components/ui/product/MaterialInfo";
import ReviewsSection from "@/components/ui/product/ReviewsSection";
import RelatedProducts from "@/components/ui/product/RelatedProducts";
import ProductActions from "@/components/ui/product/ProductActions";

const ProductViewerCanvas = dynamic(
  () => import("@/components/canvas/product/ProductViewerCanvas"),
  { ssr: false }
);

function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/**
 * Phase 7: Product Details Universe।
 *
 * Layout: Desktop-এ left half = 3D 360° viewer, right half = scrollable
 * info panel (color, size, material, reviews, related, actions)। Mobile-এ
 * viewer উপরে (ছোট), info panel নিচে stack হয়ে স্ক্রল হয়।
 *
 * Main Hall থেকে pedestal click করে এখানে আসা হয় (selectedProductId
 * store-এ pedestalKey আকারে থাকে, যেমন "new-arrival-0")। সরাসরি এই
 * scene-এ ঢুকলে (যেমন reload) কোনো product না থাকলে fallback message
 * দেখানো হয়।
 */
export default function ProductDetailScene() {
  const setScene = useUniverseStore((s) => s.setScene);
  const selectedProductId = useUniverseStore((s) => s.selectedProductId);
  const setSelectedProductId = useUniverseStore((s) => s.setSelectedProductId);
  const addToCart = useUniverseStore((s) => s.addToCart);
  const triggerFlyToCart = useUniverseStore((s) => s.triggerFlyToCart);
  const isMobile = useIsMobile();

  const product = useMemo(
    () => (selectedProductId ? getProductDetail(selectedProductId) : null),
    [selectedProductId]
  );

  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product?.colors[0] ?? { name: "Black", nameBn: "কালো", hex: "#0d0d12" }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[2] ?? "L"
  );

  const handleBack = useCallback(() => {
    setSelectedProductId(null);
    setScene("mainHall");
  }, [setScene, setSelectedProductId]);

  const handleRelatedSelect = useCallback(
    (pedestalKey: string) => {
      setSelectedProductId(pedestalKey);
      // নতুন product-এর জন্য default selection রিসেট
      setSelectedColor({ name: "Black", nameBn: "কালো", hex: "#0d0d12" });
      setSelectedSize("L");
    },
    [setSelectedProductId]
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      nameBn: product.nameBn,
      price: product.price,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      zoneColor: product.zoneColor,
    });
    triggerFlyToCart(selectedColor.hex);
  }, [product, selectedColor, selectedSize, addToCart, triggerFlyToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      nameBn: product.nameBn,
      price: product.price,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      zoneColor: product.zoneColor,
    });
    setScene("checkout");
  }, [product, selectedColor, selectedSize, addToCart, setScene]);

  // ── Fallback: directly load করা হলে বা product না পাওয়া গেলে ──
  if (!product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-obsidian px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-electric neon-text-cyan">
          Phase 7
        </p>
        <h2 className="font-display text-2xl font-bold text-bone">
          কোনো প্রোডাক্ট সিলেক্ট করা নেই
        </h2>
        <p className="max-w-xs font-body text-sm text-smoke">
          Main Hall থেকে একটা pedestal click করলে এখানে তার details দেখতে পাবে।
        </p>
        <button
          onClick={handleBack}
          className="rounded-full border border-ember/30 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ember transition-colors hover:bg-ember/5"
        >
          ← Main Hall-এ ফিরে যাও
        </button>
      </div>
    );
  }

  const relatedProducts = product.relatedPedestalKeys.map((key) => {
    const lastHyphen = key.lastIndexOf("-");
    const idx = parseInt(key.slice(lastHyphen + 1), 10) || 0;
    return { key, product: getPlaceholderProduct(product.zoneId, idx) };
  });

  const averageRating =
    Math.round(
      (product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length) *
        10
    ) / 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-void md:flex-row"
    >
      {/* Back button — top-left, always visible */}
      <button
        onClick={handleBack}
        className="glass-panel pointer-events-auto absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-smoke transition-colors hover:text-bone md:left-6 md:top-6"
      >
        <ArrowLeft size={13} strokeWidth={1.75} />
        Hall
      </button>

      {/* ── Left/Top: 360° Viewer ────────────────────────────── */}
      <div className="relative h-[42vh] w-full shrink-0 md:h-screen md:w-1/2">
        <ProductViewerCanvas
          colorHex={selectedColor.hex}
          accentHex={product.zoneColor}
          isMobile={isMobile}
        />

        {/* Drag hint */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-smoke/40">
            Drag to Rotate · 360°
          </p>
        </div>

        {/* Zone tag */}
        <div className="pointer-events-none absolute right-4 top-4 md:right-6 md:top-6">
          <p
            className="font-mono text-[9px] uppercase tracking-[0.25em]"
            style={{ color: product.zoneColor }}
          >
            {product.zoneLabel}
          </p>
        </div>
      </div>

      {/* ── Right/Bottom: Info Panel ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-6 md:flex md:w-1/2 md:items-center md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="flex w-full flex-col gap-5"
          >
            {/* Title + price + rating */}
            <div className="flex flex-col gap-1.5">
              <h1 className="font-display text-2xl font-extrabold text-bone sm:text-3xl">
                {product.name}
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-smoke">
                {product.nameBn}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-display text-xl font-bold text-ember">
                  ৳{product.price}
                </span>
                <span className="font-mono text-xs text-smoke">
                  ★ {averageRating} ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            <p className="font-body text-xs leading-relaxed text-smoke/80">
              {product.description}
            </p>

            <ColorSwitch
              colors={product.colors}
              selected={selectedColor}
              onSelect={setSelectedColor}
            />

            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />

            <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />

            <MaterialInfo material={product.material} materialBn={product.materialBn} />

            <ReviewsSection reviews={product.reviews} averageRating={averageRating} />

            <RelatedProducts
              products={relatedProducts}
              zoneColor={product.zoneColor}
              onSelect={handleRelatedSelect}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
