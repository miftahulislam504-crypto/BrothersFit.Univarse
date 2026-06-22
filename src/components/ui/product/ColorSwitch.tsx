"use client";

import { ColorOption } from "@/lib/productDetail";

interface ColorSwitchProps {
  colors: ColorOption[];
  selected: ColorOption;
  onSelect: (color: ColorOption) => void;
}

export default function ColorSwitch({ colors, selected, onSelect }: ColorSwitchProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
        Color · {selected.name}
      </p>
      <div className="flex gap-2.5">
        {colors.map((color) => {
          const isActive = color.hex === selected.hex;
          return (
            <button
              key={color.hex}
              onClick={() => onSelect(color)}
              aria-label={color.name}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200"
              style={{
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full border transition-colors duration-200"
                style={{
                  borderColor: isActive ? color.hex : "rgba(242,239,233,0.15)",
                  borderWidth: isActive ? 2 : 1,
                }}
              />
              <span
                className="h-6 w-6 rounded-full border border-white/10"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
