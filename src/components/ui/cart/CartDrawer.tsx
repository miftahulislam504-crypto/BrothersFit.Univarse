"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useUniverseStore } from "@/store/useUniverseStore";

/**
 * Phase 8: Shopping Bag — Side Drawer।
 *
 * ডানদিক থেকে slide করে খোলে (glass panel)। প্রতিটা line item-এ
 * thumbnail-এর বদলে color swatch + name + size দেখানো হয় (এখনো real
 * product photo নেই)। Quantity +/- করা যায়, remove করা যায়।
 * খালি থাকলে empty state দেখায়। Checkout button scene-কে "checkout"-এ
 * পাঠায় (Phase 9-এ পূর্ণ হবে)।
 */
export default function CartDrawer() {
  const isCartOpen = useUniverseStore((s) => s.isCartOpen);
  const setCartOpen = useUniverseStore((s) => s.setCartOpen);
  const cartItems = useUniverseStore((s) => s.cartItems);
  const updateCartQuantity = useUniverseStore((s) => s.updateCartQuantity);
  const removeFromCart = useUniverseStore((s) => s.removeFromCart);
  const setScene = useUniverseStore((s) => s.setScene);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setScene("checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[55] bg-void/70 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel fixed right-0 top-0 z-[56] flex h-screen w-full max-w-sm flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-bone" strokeWidth={1.75} />
                <h2 className="font-display text-base font-bold text-bone">
                  Shopping Bag
                </h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[10px] text-ember">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="text-smoke transition-colors hover:text-bone"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag size={32} className="text-smoke/30" strokeWidth={1.25} />
                  <p className="font-mono text-xs uppercase tracking-widest text-smoke">
                    তোমার ব্যাগ খালি
                  </p>
                  <p className="max-w-[200px] font-body text-xs text-smoke/60">
                    Main Hall ঘুরে পছন্দের product যোগ করো
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 overflow-hidden rounded-xl border border-white/8 p-3"
                      >
                        {/* Color swatch thumbnail */}
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${item.zoneColor}15` }}
                        >
                          <span
                            className="h-6 w-6 rounded-full border border-white/15"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-xs font-semibold leading-tight text-bone">
                              {item.name}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              aria-label="Remove item"
                              className="shrink-0 text-smoke/50 transition-colors hover:text-ember"
                            >
                              <Trash2 size={13} strokeWidth={1.75} />
                            </button>
                          </div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-smoke">
                            {item.colorName} · {item.size}
                          </p>

                          <div className="mt-1 flex items-center justify-between">
                            {/* Quantity stepper */}
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 px-1.5 py-1">
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.cartItemId, item.quantity - 1)
                                }
                                aria-label="Decrease quantity"
                                className="text-smoke transition-colors hover:text-bone"
                              >
                                <Minus size={11} strokeWidth={2} />
                              </button>
                              <span className="min-w-[1rem] text-center font-mono text-[11px] text-bone">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.cartItemId, item.quantity + 1)
                                }
                                aria-label="Increase quantity"
                                className="text-smoke transition-colors hover:text-bone"
                              >
                                <Plus size={11} strokeWidth={2} />
                              </button>
                            </div>

                            <span className="font-mono text-xs text-ember">
                              ৳{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/8 px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-smoke">
                    Subtotal
                  </span>
                  <span className="font-display text-lg font-bold text-bone">
                    ৳{subtotal}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-ember py-3.5 font-mono text-xs uppercase tracking-widest text-void transition-opacity hover:opacity-90"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
