"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles } from "lucide-react";
import { useUniverseStore } from "@/store/useUniverseStore";
import { HALL_ZONES } from "@/lib/hallZones";
import { getAllSearchableProducts, SearchableProduct } from "@/lib/placeholderProducts";

interface SearchOverlayProps {
  onZoneJump: (zoneId: string) => void;
}

/**
 * Phase 5: AI-Powered Smart Search।
 *
 * এখন backend AI নেই (এখনো কোনো catalog/LLM connect করা হয়নি) —
 * তাই client-side fuzzy match দিয়ে কাজ চালানো হচ্ছে, কিন্তু UI আর flow
 * পুরোপুরি ready যাতে Phase 7+-এ Firestore + (পরবর্তীতে) real AI
 * search backend বসালে শুধু `runSearch` function বদলালেই চলবে।
 *
 * Match করে: product name (en/bn), zone label।
 */
const ALL_PRODUCTS = getAllSearchableProducts(HALL_ZONES);

function runSearch(query: string): SearchableProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameBn.includes(q) ||
      p.zoneLabel.toLowerCase().includes(q)
  ).slice(0, 8);
}

export default function SearchOverlay({ onZoneJump }: SearchOverlayProps) {
  const isOpen = useUniverseStore((s) => s.isSearchOpen);
  const setSearchOpen = useUniverseStore((s) => s.setSearchOpen);
  const setSelectedProductId = useUniverseStore((s) => s.setSelectedProductId);

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => runSearch(query), [query]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setSearchOpen]);

  const handleResultClick = (product: SearchableProduct) => {
    setSelectedProductId(product.id);
    onZoneJump(product.zoneId);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur-xl"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-20 w-full max-w-xl px-6 sm:mt-28"
          >
            {/* Search input */}
            <div className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-4">
              <Sparkles size={16} className="shrink-0 text-ember" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                inputMode="search"
                placeholder="Search products, collections..."
                className="w-full bg-transparent font-body text-sm text-bone placeholder:text-smoke/50 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="shrink-0 text-smoke transition-colors hover:text-bone"
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              )}
            </div>

            <p className="mt-3 px-2 font-mono text-[9px] uppercase tracking-[0.3em] text-smoke/40">
              AI Powered Search
            </p>

            {/* Results */}
            <div className="mt-4 flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {results.map((product) => (
                  <motion.button
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleResultClick(product)}
                    className="glass-panel flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold text-bone">
                        {product.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-smoke">
                        {product.zoneLabel}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono text-xs text-ember">৳{product.price}</span>
                      <span className="font-mono text-[9px] text-smoke">★ {product.rating}</span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>

              {query.trim() && results.length === 0 && (
                <p className="mt-6 text-center font-mono text-xs text-smoke">
                  কোনো ফলাফল পাওয়া যায়নি &ldquo;{query}&rdquo;-এর জন্য
                </p>
              )}

              {!query.trim() && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {HALL_ZONES.slice(0, 5).map((zone) => {
                    const firstProduct = ALL_PRODUCTS.find(
                      (p) => p.zoneId === zone.id
                    );
                    if (!firstProduct) return null;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => handleResultClick(firstProduct)}
                        className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-smoke transition-colors hover:border-white/20 hover:text-bone"
                      >
                        {zone.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-widest text-smoke/30">
              ESC চাপলে বন্ধ হবে
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
