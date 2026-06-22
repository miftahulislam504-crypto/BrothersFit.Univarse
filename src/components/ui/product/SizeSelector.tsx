"use client";

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
        Size · {selected}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isActive = size === selected;
          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${
                isActive
                  ? "border-ember bg-ember/10 text-ember"
                  : "border-white/10 text-smoke hover:border-white/25 hover:text-bone"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
