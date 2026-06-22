import { getPlaceholderProduct, PedestalProduct } from "./placeholderProducts";
import { getZoneById } from "./hallZones";

/**
 * Phase 7: Product Details Universe-এর জন্য extended data layer।
 * Main Hall-এর pedestal click করলে যে `pedestalKey` (যেমন "new-arrival-0")
 * পাওয়া যায়, সেটা parse করে পূর্ণ product detail বানানো হয়।
 *
 * এখনো real Firestore catalog নেই — তাই color/size/material/reviews সব
 * deterministic placeholder, কিন্তু interface যেভাবে সাজানো হয়েছে সেটা
 * পরে real backend দিয়ে সরাসরি replace করা যাবে।
 */

export interface ColorOption {
  name: string;
  nameBn: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

export interface ProductDetail extends PedestalProduct {
  zoneId: string;
  zoneLabel: string;
  zoneColor: string;
  colors: ColorOption[];
  sizes: string[];
  material: string;
  materialBn: string;
  description: string;
  reviews: Review[];
  relatedPedestalKeys: string[];
}

export const COLOR_OPTIONS: ColorOption[] = [
  { name: "Black", nameBn: "কালো", hex: "#0d0d12" },
  { name: "White", nameBn: "সাদা", hex: "#f2efe9" },
  { name: "Navy", nameBn: "নেভি", hex: "#1c2a4a" },
  { name: "Gray", nameBn: "ধূসর", hex: "#6b6b76" },
];

export const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const MATERIAL_DESCRIPTIONS = [
  {
    en: "Premium 220 GSM combed cotton — soft, breathable, built to hold shape after repeated wash.",
    bn: "প্রিমিয়াম ২২০ জিএসএম কম্বড কটন — নরম, বাতাস চলাচল করে, বারবার ধোয়ার পরও আকৃতি ঠিক থাকে।",
  },
  {
    en: "Brushed fleece interior with a cotton-poly blend shell for warmth without bulk.",
    bn: "ব্রাশড ফ্লিস ভেতরে, কটন-পলি ব্লেন্ড বাইরে — ভারী না হয়েও যথেষ্ট উষ্ণতা দেয়।",
  },
  {
    en: "Mercerized cotton pique knit — structured collar, breathable, classic drape.",
    bn: "মার্সারাইজড কটন পিকে নিট — গঠিত কলার, বাতাস চলাচল করে, ক্লাসিক ফল।",
  },
];

const REVIEW_AUTHORS = ["Rakib", "Tanvir", "Mahin", "Fahim", "Sabbir", "Imran"];
const REVIEW_COMMENTS_EN = [
  "Fit is exactly as expected, great fabric quality.",
  "Color stayed true after multiple washes.",
  "Comfortable for daily wear, would buy again.",
  "Sizing runs slightly large, order one size down.",
  "Excellent stitching, premium feel for the price.",
];

/**
 * pedestalKey ("zoneId-index") parse করে zone আর pedestal index আলাদা করে।
 * zoneId নিজেও hyphen ধারণ করতে পারে (যেমন "best-seller"), তাই
 * শেষ hyphen থেকে split করা হচ্ছে, প্রথমটা থেকে না।
 */
function parsePedestalKey(pedestalKey: string): { zoneId: string; index: number } {
  const lastHyphen = pedestalKey.lastIndexOf("-");
  const zoneId = pedestalKey.slice(0, lastHyphen);
  const index = parseInt(pedestalKey.slice(lastHyphen + 1), 10) || 0;
  return { zoneId, index };
}

export function getProductDetail(pedestalKey: string): ProductDetail | null {
  const { zoneId, index } = parsePedestalKey(pedestalKey);
  const zone = getZoneById(zoneId);
  if (!zone) return null;

  const base = getPlaceholderProduct(zoneId, index);
  const materialSeed = (zoneId.length + index) % MATERIAL_DESCRIPTIONS.length;
  const material = MATERIAL_DESCRIPTIONS[materialSeed];

  // Deterministic reviews — same product always shows same reviews
  const reviewCount = 3 + (index % 2);
  const reviews: Review[] = Array.from({ length: reviewCount }).map((_, i) => {
    const seed = (zoneId.length * 5 + index * 11 + i * 17) % 100;
    return {
      id: `${pedestalKey}-review-${i}`,
      author: REVIEW_AUTHORS[seed % REVIEW_AUTHORS.length],
      rating: 4 + (seed % 2),
      comment: REVIEW_COMMENTS_EN[seed % REVIEW_COMMENTS_EN.length],
      daysAgo: 2 + (seed % 28),
    };
  });

  // একই zone-এর বাকি pedestal-গুলো related হিসেবে দেখানো হবে
  const relatedPedestalKeys = [0, 1, 2]
    .filter((i) => i !== index)
    .map((i) => `${zoneId}-${i}`);

  return {
    ...base,
    zoneId,
    zoneLabel: zone.label,
    zoneColor: zone.color,
    colors: COLOR_OPTIONS,
    sizes: SIZE_OPTIONS,
    material: material.en,
    materialBn: material.bn,
    description:
      "BrotherFit Universe-এর সিগনেচার কালেকশন থেকে এই পিসটি বানানো হয়েছে আরামদায়ক প্রতিদিনের পরিধানের জন্য, প্রিমিয়াম ফেব্রিক আর নিখুঁত ফিনিশিং সহ।",
    reviews,
    relatedPedestalKeys,
  };
}
