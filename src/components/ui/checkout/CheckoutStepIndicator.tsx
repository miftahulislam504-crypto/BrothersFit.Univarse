"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface CheckoutStepIndicatorProps {
  currentStep: "address" | "payment" | "confirmation";
}

const STEPS: { key: "address" | "payment" | "confirmation"; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirm" },
];

export default function CheckoutStepIndicator({
  currentStep,
}: CheckoutStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isComplete || isActive ? "#ff3d1a" : "rgba(242,239,233,0.08)",
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full"
              >
                {isComplete ? (
                  <Check size={12} className="text-void" strokeWidth={2.5} />
                ) : (
                  <span
                    className={`font-mono text-[10px] ${
                      isActive ? "text-void" : "text-smoke"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`font-mono text-[9px] uppercase tracking-widest ${
                  isActive ? "text-bone" : "text-smoke/50"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="mb-4 h-px w-8 sm:w-12">
                <div
                  className="h-full transition-colors duration-300"
                  style={{
                    backgroundColor: isComplete ? "#ff3d1a" : "rgba(242,239,233,0.1)",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
