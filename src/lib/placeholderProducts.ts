/**
 * প্রতিটা pedestal-এর জন্য placeholder product info।
 * Phase 7-এ যখন real Firestore catalog যুক্ত হবে, তখন এই static
 * data সেখান থেকে fetch করা data দিয়ে replace হবে। এখন structure
 * আর UI flow test করার জন্য predictable placeholder ব্যবহার হচ্ছে।
 */

export interface PedestalProduct {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  rating: number;
  /**
   * Step 4 — product photo URL। auto-derive হয়: `/products/${id}.png`
   * ফাইল না থাকলে octahedron hologram fallback দেখাবে — site ভাঙবে না।
   * নিজে সেট না করলেও getPlaceholderProduct auto-ভরে দেয়।
   */
  imageUrl?: string;
}

const NAME_POOL: { name: string; nameBn: string }[] = [
  { name: "Signature Tee", nameBn: "সিগনেচার টি-শার্ট" },
  { name: "Street Hoodie", nameBn: "স্ট্রিট হুডি" },
  { name: "Classic Polo", nameBn: "ক্লাসিক পোলো" },
];

/**
 * zoneId + pedestalIndex থেকে deterministic একটা placeholder product বানায়।
 * Random না — যাতে re-render-এ একই pedestal একই product দেখায়।
 */
export function getPlaceholderProduct(
  zoneId: string,
  pedestalIndex: number
): PedestalProduct {
  const pool = NAME_POOL[pedestalIndex % NAME_POOL.length];
  // Deterministic pseudo-random price/rating from zoneId+index
  const seed = zoneId.length * 7 + pedestalIndex * 13;
  const price = 990 + (seed % 8) * 250;
  const rating = 4.2 + ((seed % 7) / 10);

  return {
    id: `${zoneId}-${pedestalIndex}`,
    name: pool.name,
    nameBn: pool.nameBn,
    price,
    rating: Math.round(rating * 10) / 10,
    // Step 4: public/products/ ফোল্ডারে এই নামে PNG রাখলেই দেখাবে।
    // ফাইল না থাকলে useSafeTexture null দেবে → octahedron fallback চলবে।
    imageUrl: `/products/${zoneId}-${pedestalIndex}.png`,
  };
}

export interface SearchableProduct extends PedestalProduct {
  zoneId: string;
  zoneLabel: string;
}

/**
 * Search bar-এর জন্য — সব zone-এর সব pedestal (zone প্রতি ৩টা) মিলিয়ে
 * একটা flat, searchable list তৈরি করে। Phase 7-এ real Firestore
 * catalog এলে এই function-টা সেখান থেকে query করবে, কিন্তু interface
 * (SearchableProduct) একই থাকবে যাতে SearchOverlay বদলাতে না হয়।
 */
export function getAllSearchableProducts(
  zones: { id: string; label: string }[]
): SearchableProduct[] {
  const results: SearchableProduct[] = [];
  for (const zone of zones) {
    for (let i = 0; i < 3; i++) {
      const product = getPlaceholderProduct(zone.id, i);
      results.push({ ...product, zoneId: zone.id, zoneLabel: zone.label });
    }
  }
  return results;
}
