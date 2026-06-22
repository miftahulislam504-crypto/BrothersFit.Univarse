"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Optional real texture file load করার জন্য — drei-র useTexture-এর মতো
 * Suspense/error throw করে না, ফাইল না পেলে (404) চুপচাপ null রিটার্ন
 * করে। এভাবে Step 3-এর marble texture-এর মতো "থাকলে upgrade, না থাকলে
 * আগের procedural color-ই থাকবে" pattern বানানো যায়, কোনো crash ছাড়াই।
 *
 * @param url    টেক্সচার ফাইলের পাথ, অথবা null দিলে load-ই হবে না
 * @param repeat কতবার tile/repeat হবে (UV repeat), default 1
 */
export function useSafeTexture(
  url: string | null,
  repeat: number = 1
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    let cancelled = false;
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (tex) => {
        if (cancelled) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeat, repeat);
        setTexture(tex);
      },
      undefined,
      () => {
        // ফাইল নেই বা load fail করেছে — silently fallback, কোনো error throw না
        if (!cancelled) setTexture(null);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url, repeat]);

  return texture;
}
