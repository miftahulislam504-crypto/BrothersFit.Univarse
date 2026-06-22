# HDRI ফোল্ডার

দুটো HDRI দরকার — scene দুটো আলাদা mood-এর:

---

## ১. Interior Hall HDRI — `decor-shop.hdr`

**Scene:** Main Hall (showroom interior)
**Preset fallback:** `"lobby"` (CDN থেকে আসে, কাজ করছে)

### ডাউনলোড

Poly Haven → **Decor Shop**
https://polyhaven.com/a/decor_shop

CC0। Format: `HDR`, Resolution: `1k` বা `2k`।
ডাউনলোড করা ফাইলের নাম বদলে এই folder-এ রাখো: `decor-shop.hdr`

---

## ২. Exterior Night HDRI — `night-street.hdr`

**Scene:** Shop Exterior (রাতের রাস্তা, rain, neon)
**Preset fallback:** `"city"` (CDN থেকে আসে, কাজ করছে)

### ডাউনলোড

Poly Haven → **Evening Road 01**
https://polyhaven.com/a/evening_road_01

CC0। রাতের রাস্তার উপর থেকে নেওয়া HDRI — urban artificial light ambient,
BrotherFit Exterior-এর rainy night mood-এর সাথে মেলে।
Format: `HDR`, Resolution: `1k`।
ডাউনলোড করা ফাইলের নাম বদলে এই folder-এ রাখো: `night-street.hdr`

---

## এরপর কী

যেকোনো একটা বা দুটোই রাখো — যেটা নেই সেটা preset-এ চলবে।
Push করলেই Vercel-এ সাথে সাথে কাজ শুরু করবে, কোনো code change লাগবে না।
