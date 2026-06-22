"use client";

import { motion } from "framer-motion";
import { CreditCard, Smartphone, Banknote, Check } from "lucide-react";
import { PaymentMethod } from "@/store/useUniverseStore";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const METHODS: {
  key: PaymentMethod;
  label: string;
  labelBn: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    key: "mobile-banking",
    label: "Mobile Banking",
    labelBn: "মোবাইল ব্যাংকিং",
    description: "bKash, Nagad, Rocket — SSLCommerz এর মাধ্যমে",
    icon: Smartphone,
  },
  {
    key: "card",
    label: "Credit / Debit Card",
    labelBn: "কার্ড পেমেন্ট",
    description: "Visa, Mastercard — Stripe এর মাধ্যমে",
    icon: CreditCard,
  },
  {
    key: "cod",
    label: "Cash on Delivery",
    labelBn: "ক্যাশ অন ডেলিভারি",
    description: "পণ্য হাতে পেয়ে টাকা পরিশোধ করুন",
    icon: Banknote,
  },
];

/**
 * Phase 9: Payment Integration — UI scaffold।
 *
 * এখনো real Stripe/SSLCommerz API key যুক্ত হয়নি (সেটার জন্য Stripe
 * Dashboard ও SSLCommerz Merchant Panel থেকে credential লাগবে, যেগুলো
 * .env-এ বসাতে হবে)। এই ধাপে UI flow সম্পূর্ণ প্রস্তুত — পরে real
 * payment gateway integrate করতে শুধু `onConfirm` handler-এর ভেতরে
 * actual API call বসালেই চলবে। এখন placeholder card preview দেখানো হয়
 * card পেমেন্ট সিলেক্ট করলে, যাতে UX সম্পূর্ণ মনে হয়।
 */
export default function PaymentMethodSelector({
  selected,
  onSelect,
  onConfirm,
  onBack,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {METHODS.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.key;

        return (
          <button
            key={method.key}
            onClick={() => onSelect(method.key)}
            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors duration-200 ${
              isActive
                ? "border-ember/50 bg-ember/5"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isActive ? "bg-ember/15 text-ember" : "bg-white/5 text-smoke"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="font-display text-sm font-semibold text-bone">
                {method.label}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-smoke">
                {method.labelBn}
              </p>
              <p className="font-body text-[11px] text-smoke/60">
                {method.description}
              </p>
            </div>
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                isActive ? "border-ember bg-ember" : "border-white/20"
              }`}
            >
              {isActive && <Check size={11} className="text-void" strokeWidth={3} />}
            </div>
          </button>
        );
      })}

      {/* Card preview — শুধু card payment selected হলে দেখানো হয়, UI completeness-এর জন্য */}
      {selected === "card" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="glass-panel flex flex-col gap-3 rounded-xl p-4">
            <input
              type="text"
              placeholder="Card Number"
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 font-mono text-xs text-smoke placeholder:text-smoke/40"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / YY"
                disabled
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 font-mono text-xs text-smoke placeholder:text-smoke/40"
              />
              <input
                type="text"
                placeholder="CVC"
                disabled
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 font-mono text-xs text-smoke placeholder:text-smoke/40"
              />
            </div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-smoke/40">
              Stripe integration আসছে — এখন এটি একটি প্রিভিউ
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-2 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-white/10 py-3.5 font-mono text-xs uppercase tracking-widest text-smoke transition-colors hover:border-white/25 hover:text-bone"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-ember py-3.5 font-mono text-xs uppercase tracking-widest text-void transition-opacity hover:opacity-90"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
