# Product Images ফোল্ডার

এখানে product photo রাখলে 3D hall-এর pedestal-এ সেই photo দেখাবে।

## Naming Convention

ফাইলের নাম হবে: `{zoneId}-{pedestalIndex}.png`

| Zone | Pedestal | File Name |
|------|----------|-----------|
| New Arrival | Center | `new-arrival-0.png` |
| New Arrival | Left | `new-arrival-1.png` |
| New Arrival | Right | `new-arrival-2.png` |
| Men Collection | Center | `men-0.png` |
| Men Collection | Left | `men-1.png` |
| Men Collection | Right | `men-2.png` |
| Joggers Zone | Center | `joggers-0.png` |
| Joggers Zone | Left | `joggers-1.png` |
| Joggers Zone | Right | `joggers-2.png` |
| Winter Collection | Center | `winter-0.png` |
| Winter Collection | Left | `winter-1.png` |
| Winter Collection | Right | `winter-2.png` |
| Best Seller | Center | `best-seller-0.png` |
| Best Seller | Left | `best-seller-1.png` |
| Best Seller | Right | `best-seller-2.png` |
| Accessories | Center | `accessories-0.png` |
| Accessories | Left | `accessories-1.png` |
| Accessories | Right | `accessories-2.png` |
| Sale Area | Center | `sale-0.png` |
| Sale Area | Left | `sale-1.png` |
| Sale Area | Right | `sale-2.png` |

## Background কেমন হলে ভালো দেখাবে

ভালো (এই ক্রমে):
- **সাদা background** — সবচেয়ে সহজ, scene-এর dark hall-এ clearly দেখা যায়
- **Transparent background (PNG alpha)** — `alphaTest: 0.05` দিয়ে
  background কেটে যাবে, শুধু জামা দেখাবে
- **হালকা ধূসর background** — studio photo style

এড়ানো উচিত:
- অন্ধকার background — hall নিজেই dark, contrast পাওয়া যাবে না
- complicated background — photo-frame-এর focus থাকা উচিত product-এ

## ছবি তোলার টিপস (ফোনে)

- জামা flat lay (টেবিলে বিছিয়ে) অথবা hanger-এ ঝুলিয়ে তোলো
- natural daylight বা সাদা LED-এর কাছে তোলো
- portrait orientation (লম্বালম্বি) — frame 2:3 ratio
- অন্তত 800×1200 px হলে ভালো, 1200×1800 px ideal

## এরপর কী

ফাইল রাখার পর Vercel-এ push করলেই সাথে সাথে hall-এ দেখাবে।
কোনো code change লাগবে না।
