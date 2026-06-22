"use client";

import { motion } from "framer-motion";
import { Check, Package, Home } from "lucide-react";
import { PlacedOrder } from "@/store/useUniverseStore";

interface OrderConfirmationProps {
  order: PlacedOrder;
  onContinueShopping: () => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  card: "Card Payment",
  "mobile-banking": "Mobile Banking",
  cod: "Cash on Delivery",
};

/**
 * Phase 9: Order Confirmation + Success Animation।
 * Checkmark draw-in animation, order ID, delivery estimate, এবং
 * "Continue Shopping" বাটন যেটা cart clear করে Main Hall-এ ফিরিয়ে নেয়।
 */
export default function OrderConfirmation({
  order,
  onContinueShopping,
}: OrderConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-md flex-col items-center gap-6 text-center"
    >
      {/* Success checkmark — circle draw + check pop */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute inset-0 rounded-full bg-ember/15"
        />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ember"
        >
          <Check size={26} className="text-void" strokeWidth={3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="font-display text-2xl font-extrabold text-bone sm:text-3xl">
          অর্ডার সফল হয়েছে!
        </h1>
        <p className="font-body text-sm text-smoke">
          তোমার অর্ডার গ্রহণ করা হয়েছে, ধন্যবাদ BrotherFit Universe-এ কেনাকাটার জন্য।
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="glass-panel flex w-full flex-col gap-3 rounded-2xl p-5 text-left"
      >
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            Order ID
          </span>
          <span className="font-mono text-xs font-bold text-ember">{order.orderId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            Items
          </span>
          <span className="font-mono text-xs text-bone">
            {order.items.reduce((sum, i) => sum + i.quantity, 0)} pieces
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            Payment
          </span>
          <span className="font-mono text-xs text-bone">
            {PAYMENT_LABELS[order.paymentMethod]}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-smoke">
            Delivery To
          </span>
          <span className="max-w-[60%] text-right font-mono text-xs text-bone">
            {order.address.area}, {order.address.district}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 pt-3">
          <span className="font-mono text-xs uppercase tracking-widest text-smoke">
            Total Paid
          </span>
          <span className="font-display text-lg font-bold text-ember">
            ৳{order.total}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex items-center gap-2 text-smoke"
      >
        <Package size={14} strokeWidth={1.75} />
        <p className="font-mono text-[10px] uppercase tracking-wider">
          আনুমানিক ডেলিভারি ৩-৫ কর্মদিবস
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        onClick={onContinueShopping}
        className="mt-2 flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:border-ember hover:text-ember"
      >
        <Home size={14} strokeWidth={1.75} />
        Continue Shopping
      </motion.button>
    </motion.div>
  );
}
