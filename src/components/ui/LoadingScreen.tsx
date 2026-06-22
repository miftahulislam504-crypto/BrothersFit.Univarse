"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverseStore } from "@/store/useUniverseStore";

/**
 * Phase 1: Cinematic Loading Screen (upgraded)
 *
 * তিনটি স্তরে সাজানো:
 * 1. Logo reveal — letter-by-letter stagger animation
 * 2. Progress bar — thin horizontal line, ember fill
 * 3. Status text — loading phase বলে ("Initializing Universe...", ইত্যাদি)
 *
 * Future: Phase 2-এ Three.js asset loader-এর সাথে hook করলে
 * loadingProgress real asset loading reflect করবে।
 * এখন simulated timing ব্যবহার করছি।
 */

const LOADING_PHASES = [
  { threshold: 0, text: "Universe Initializing..." },
  { threshold: 25, text: "Loading Dark Matter..." },
  { threshold: 50, text: "Calibrating Neon Grid..." },
  { threshold: 72, text: "Preparing Collections..." },
  { threshold: 90, text: "Almost There..." },
  { threshold: 99, text: "Welcome." },
];

const BRAND_LETTERS = ["B", "R", "O", "T", "H", "E", "R", "F", "I", "T"];

function getCurrentPhaseText(progress: number): string {
  let text = LOADING_PHASES[0].text;
  for (const phase of LOADING_PHASES) {
    if (progress >= phase.threshold) text = phase.text;
  }
  return text;
}

export default function LoadingScreen() {
  const { loadingProgress, setLoadingProgress, setScene } = useUniverseStore();
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Brief pause before starting — dramatic effect
  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    intervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        // Realistic: fast at start, slow in middle, fast at end
        let increment = 0;
        if (prev < 30) increment = 4 + Math.random() * 8;
        else if (prev < 70) increment = 1.5 + Math.random() * 3;
        else if (prev < 92) increment = 0.8 + Math.random() * 2;
        else increment = 0.4 + Math.random() * 1;

        const next = Math.min(prev + increment, 100);

        if (next >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          // Hold at 100% briefly, then exit
          setTimeout(() => setIsExiting(true), 600);
          setTimeout(() => setScene("arrival"), 1400);
        }

        return next;
      });
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showContent, setLoadingProgress, setScene]);

  const phaseText = getCurrentPhaseText(loadingProgress);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
        >
          {/* Subtle vignette corners */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,5,10,0.8)_100%)]" />

          <div className="relative flex flex-col items-center gap-10">
            {/* Brand name — letter stagger reveal */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {BRAND_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={showContent ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`font-display text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl ${
                    i >= 7
                      ? "text-ember neon-text"  // "FIT" — ember color
                      : "text-bone"              // "BROTHER" — bone white
                  }`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Universe subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 1 }}
              className="font-mono text-[10px] uppercase tracking-[0.5em] text-smoke md:text-xs"
            >
              Universe
            </motion.p>

            {/* Progress section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex w-48 flex-col items-center gap-3 sm:w-64 md:w-72"
            >
              {/* Progress bar */}
              <div className="relative h-px w-full overflow-hidden bg-bone/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-ember"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
                {/* Glow on bar tip */}
                <motion.div
                  className="absolute inset-y-0 w-6 bg-gradient-to-r from-ember to-transparent blur-sm"
                  style={{ left: `calc(${loadingProgress}% - 24px)` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>

              {/* Status row */}
              <div className="flex w-full items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phaseText}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.35 }}
                    className="font-mono text-[10px] uppercase tracking-wider text-smoke md:text-xs"
                  >
                    {phaseText}
                  </motion.p>
                </AnimatePresence>

                <p className="font-mono text-[10px] tabular-nums text-smoke/60 md:text-xs">
                  {Math.floor(loadingProgress).toString().padStart(2, "0")}%
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom corner accent lines — fashion editorial feel */}
          <div className="pointer-events-none absolute bottom-8 left-8 h-8 w-8 border-b border-l border-bone/10" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-8 w-8 border-b border-r border-bone/10" />
          <div className="pointer-events-none absolute left-8 top-8 h-8 w-8 border-l border-t border-bone/10" />
          <div className="pointer-events-none absolute right-8 top-8 h-8 w-8 border-r border-t border-bone/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
