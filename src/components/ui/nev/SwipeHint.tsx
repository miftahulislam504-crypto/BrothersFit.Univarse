"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeHintProps {
  visible: boolean;
}

/**
 * Mobile-এ swipe navigation আছে সেটা hint করার জন্য — দুই পাশে
 * subtle arrow, কিছুক্ষণ পর fade out হয়ে যায় (intro hint-এর মতোই)।
 * Desktop-এ এটা দরকার নেই কারণ keyboard arrow key ব্যবহার হয় এবং
 * mini-map/nav দিয়েই navigation visible।
 */
export default function SwipeHint({ visible }: SwipeHintProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 0.35, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 md:hidden"
          >
            <motion.div
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronLeft size={20} strokeWidth={1.5} className="text-bone" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 0.35, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 md:hidden"
          >
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronRight size={20} strokeWidth={1.5} className="text-bone" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
