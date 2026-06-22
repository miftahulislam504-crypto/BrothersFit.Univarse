"use client";

import { useUniverseStore } from "@/store/useUniverseStore";

const sceneLabels: Record<string, { phase: string; title: string }> = {
  entering: { phase: "Phase 3",  title: "Door Animation" },
  profile:  { phase: "Phase 11", title: "Profile Space" },
};

export default function ComingNextPlaceholder() {
  const scene               = useUniverseStore((s) => s.scene);
  const setScene             = useUniverseStore((s) => s.setScene);
  const setSelectedProductId = useUniverseStore((s) => s.setSelectedProductId);

  const info = sceneLabels[scene] ?? { phase: "Coming Soon", title: scene };

  const handleBackToHall = () => {
    setSelectedProductId(null);
    setScene("mainHall");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-obsidian px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-electric neon-text-cyan">
        {info.phase}
      </p>
      <h2 className="font-display text-3xl font-bold text-bone md:text-4xl">
        {info.title}
      </h2>

      <p className="max-w-xs font-body text-sm leading-relaxed text-smoke">
        এই অংশটা পরের ধাপে তৈরি হবে।<br />
        Phase 0 → Phase 9 পর্যন্ত সব কাজ করছে ✓
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setScene("arrival")}
          className="rounded-full border border-bone/15 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-smoke transition-colors hover:border-smoke hover:text-bone"
        >
          ← Arrival
        </button>
        <button
          onClick={() => setScene("exterior")}
          className="rounded-full border border-bone/15 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-smoke transition-colors hover:border-smoke hover:text-bone"
        >
          ← Exterior
        </button>
        <button
          onClick={handleBackToHall}
          className="rounded-full border border-ember/30 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ember transition-colors hover:border-ember hover:bg-ember/5"
        >
          ← Main Hall
        </button>
      </div>
    </div>
  );
}
