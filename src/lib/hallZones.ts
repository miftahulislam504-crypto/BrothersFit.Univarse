/**
 * Main Hall-এর প্রতিটা product zone-এর central definition।
 * 3D position, theme color, label — সব এক জায়গায়, যাতে
 * HallLayout, MiniMap, ZoneNavigator সবাই একই source of truth ব্যবহার করে।
 *
 * Layout পরিকল্পনা: ellipse আকারে zone-গুলো ছড়ানো, center-এ user দাঁড়াবে
 * এবং rotate/scroll করে চারপাশের zone দেখবে — অনেকটা boutique gallery-র মতো।
 */

export interface HallZone {
  id: string;
  label: string;
  labelBn: string;
  /** 3D position in the hall (x, y, z) */
  position: [number, number, number];
  /** Camera যেদিকে তাকাবে যখন এই zone active হবে */
  lookAt: [number, number, number];
  /** Theme accent color — hex */
  color: string;
  /** কত ডিগ্রি ঘোরানো লাগবে center থেকে (mini-map angle) */
  angle: number;
}

export const HALL_ZONES: HallZone[] = [
  {
    id: "new-arrival",
    label: "New Arrival",
    labelBn: "নতুন কালেকশন",
    position: [0, 0, -10],
    lookAt: [0, 0.8, -10],
    color: "#00f0ff",
    angle: 0,
  },
  {
    id: "men",
    label: "Men Collection",
    labelBn: "মেনস কালেকশন",
    position: [7, 0, -6],
    lookAt: [7, 0.8, -6],
    color: "#ff3d1a",
    angle: 60,
  },
  {
    id: "joggers",
    label: "Joggers Zone",
    labelBn: "জগার্স জোন",
    position: [9, 0, 1],
    lookAt: [9, 0.8, 1],
    color: "#ffb020",
    angle: 120,
  },
  {
    id: "winter",
    label: "Winter Collection",
    labelBn: "শীতকালীন কালেকশন",
    position: [4, 0, 7],
    lookAt: [4, 0.8, 7],
    color: "#6a8aff",
    angle: 180,
  },
  {
    id: "best-seller",
    label: "Best Seller",
    labelBn: "বেস্ট সেলার",
    position: [-4, 0, 7],
    lookAt: [-4, 0.8, 7],
    color: "#ff3d1a",
    angle: 220,
  },
  {
    id: "accessories",
    label: "Accessories",
    labelBn: "এক্সেসরিজ",
    position: [-9, 0, 1],
    lookAt: [-9, 0.8, 1],
    color: "#00f0ff",
    angle: 280,
  },
  {
    id: "sale",
    label: "Sale Area",
    labelBn: "সেল এরিয়া",
    position: [-7, 0, -6],
    lookAt: [-7, 0.8, -6],
    color: "#ff3d1a",
    angle: 320,
  },
];

export function getZoneById(id: string): HallZone | undefined {
  return HALL_ZONES.find((z) => z.id === id);
}
