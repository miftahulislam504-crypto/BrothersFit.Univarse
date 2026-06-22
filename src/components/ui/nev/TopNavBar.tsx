"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useUniverseStore } from "@/store/useUniverseStore";
import { HALL_ZONES, getZoneById } from "@/lib/hallZones";

interface TopNavBarProps {
  activeZoneId: string | null;
  onZoneJump: (zoneId: string) => void;
}

/**
 * Phase 5: Navigation Layer — top nav।
 * Phase 8 update: Cart icon এখন CartDrawer খোলে (আগে যেটা "cart" scene-এ
 * নিয়ে যেতো), এবং item count badge দেখায়। `data-cart-icon-target`
 * attribute FlyToCartOverlay-কে cart icon-এর exact screen position
 * বের করতে সাহায্য করে।
 *
 * Desktop: HOME, COLLECTIONS (dropdown of zones), BEST SELLERS, SALE
 *   এক horizontal glass bar-এ, ডানদিকে Search/Cart/Profile icon।
 * Mobile: শুধু logo + Search/Cart icon + hamburger, hamburger চাপলে
 *   full menu slide করে নামে (touch-friendly বড় target)।
 */
export default function TopNavBar({ activeZoneId, onZoneJump }: TopNavBarProps) {
  const setScene = useUniverseStore((s) => s.setScene);
  const setSearchOpen = useUniverseStore((s) => s.setSearchOpen);
  const setCartOpen = useUniverseStore((s) => s.setCartOpen);
  const cartItems = useUniverseStore((s) => s.cartItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const bestSellerZone = getZoneById("best-seller");
  const saleZone = getZoneById("sale");

  const handleHome = () => {
    onZoneJump("new-arrival");
    setMobileMenuOpen(false);
  };

  const handleZoneClick = (zoneId: string) => {
    onZoneJump(zoneId);
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    setCartOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── Desktop Nav Bar ───────────────────────────────────── */}
      <div className="pointer-events-auto absolute left-1/2 top-6 hidden -translate-x-1/2 md:block">
        <div className="glass-panel flex items-center gap-1 rounded-full px-2 py-2">
          <button
            onClick={handleHome}
            className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke transition-colors hover:bg-white/5 hover:text-bone"
          >
            Home
          </button>

          {/* Collections dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-white/5 hover:text-bone ${
                collectionsOpen ? "text-bone" : "text-smoke"
              }`}
            >
              Collections
            </button>
            <AnimatePresence>
              {collectionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel absolute left-1/2 top-full mt-2 flex w-48 -translate-x-1/2 flex-col gap-0.5 rounded-2xl p-2"
                >
                  {HALL_ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneClick(zone.id)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-colors hover:bg-white/5 ${
                        activeZoneId === zone.id ? "text-bone" : "text-smoke"
                      }`}
                    >
                      {zone.label}
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {bestSellerZone && (
            <button
              onClick={() => handleZoneClick("best-seller")}
              className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke transition-colors hover:bg-white/5 hover:text-bone"
            >
              Best Sellers
            </button>
          )}

          {saleZone && (
            <button
              onClick={() => handleZoneClick("sale")}
              className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ember transition-colors hover:bg-ember/10"
            >
              Sale
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop right-side icons ──────────────────────────── */}
      <div className="pointer-events-auto absolute right-6 top-6 hidden items-center gap-2 md:flex">
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-smoke transition-colors hover:text-bone"
        >
          <Search size={15} strokeWidth={1.75} />
        </button>
        <button
          data-cart-icon-target="true"
          onClick={handleCartClick}
          aria-label="Cart"
          className="glass-panel relative flex h-9 w-9 items-center justify-center rounded-full text-smoke transition-colors hover:text-bone"
        >
          <ShoppingBag size={15} strokeWidth={1.75} />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-ember px-1 font-mono text-[9px] font-bold text-void"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
        <button
          onClick={() => setScene("profile")}
          aria-label="Profile"
          className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-smoke transition-colors hover:text-bone"
        >
          <User size={15} strokeWidth={1.75} />
        </button>
      </div>

      {/* ── Mobile top bar ────────────────────────────────────── */}
      <div className="pointer-events-auto absolute left-4 right-4 top-4 flex items-center justify-between md:hidden">
        <button
          onClick={handleHome}
          className="font-display text-sm font-bold uppercase tracking-wider text-bone"
        >
          BrotherFit
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-smoke"
          >
            <Search size={15} strokeWidth={1.75} />
          </button>
          <button
            data-cart-icon-target="true"
            onClick={handleCartClick}
            aria-label="Cart"
            className="glass-panel relative flex h-9 w-9 items-center justify-center rounded-full text-smoke"
          >
            <ShoppingBag size={15} strokeWidth={1.75} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-ember px-1 font-mono text-[9px] font-bold text-void"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
            className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-smoke"
          >
            {mobileMenuOpen ? (
              <X size={16} strokeWidth={1.75} />
            ) : (
              <Menu size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="glass-panel pointer-events-auto absolute left-4 right-4 top-16 z-20 rounded-2xl p-3 md:hidden"
          >
            <button
              onClick={handleHome}
              className="w-full rounded-xl px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-white/5"
            >
              Home
            </button>

            <p className="mt-1 px-4 pt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-smoke/50">
              Collections
            </p>
            {HALL_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white/5 ${
                  activeZoneId === zone.id ? "text-bone" : "text-smoke"
                }`}
              >
                {zone.label}
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
              </button>
            ))}

            <div className="mt-1 flex gap-2 border-t border-white/5 pt-3">
              <button
                onClick={handleCartClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-smoke"
              >
                <ShoppingBag size={14} strokeWidth={1.75} />
                Cart {cartCount > 0 && `(${cartCount})`}
              </button>
              <button
                onClick={() => {
                  setScene("profile");
                  setMobileMenuOpen(false);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-smoke"
              >
                <User size={14} strokeWidth={1.75} />
                Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
