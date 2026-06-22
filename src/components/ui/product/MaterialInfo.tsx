"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MaterialInfoProps {
  material: string;
  materialBn: string;
}

export default function MaterialInfo({ material, materialBn }: MaterialInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/8 pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
          Material & Care
        </p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-smoke" strokeWidth={1.75} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pt-2 font-body text-xs leading-relaxed text-smoke/80">
              {material}
            </p>
            <p className="pt-1 font-body text-xs leading-relaxed text-smoke/60">
              {materialBn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
