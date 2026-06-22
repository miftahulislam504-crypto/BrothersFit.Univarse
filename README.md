# BrotherFit Universe

একটি Digital Fashion Universe — Phase 0 Foundation

## এই ZIP-এ কী আছে

Next.js 15 + TypeScript + Tailwind CSS দিয়ে বানানো একটা খালি কিন্তু কাজ-করা scaffold। এখনো কোনো 3D scene নেই (সেটা Phase 1-এ আসবে), কিন্তু নিচের জিনিসগুলো ready:

- Loading screen (progress bar animation)
- Arrival scene ("Welcome to BrotherFit Universe" text reveal + floating particles)
- Scene navigation state machine (Zustand দিয়ে)
- Firebase connection ফাইল (config বসানোর জন্য খালি জায়গা)
- পরের সব phase-এর জন্য dependency আগে থেকেই package.json-এ যুক্ত করা (Three.js, GSAP, Framer Motion ইত্যাদি)

## GitHub-এ Upload করার ধাপ

1. GitHub-এ একটা নতুন empty repository বানাও (নাম দিতে পারো `brotherfit-universe`)
2. **README, .gitignore, license — কোনোটাই add করবে না**, কারণ এই ZIP-এ এগুলো আগে থেকেই আছে
3. Repository খুলে "Add file" → "Upload files" চাপো
4. এই ZIP-এর ভেতরের **সব ফাইল এবং ফোল্ডার** (folder structure ঠিক রেখে) drag করে দাও
   - মনে রাখবে: `.gitignore`, `.env.example` এর মতো dot-ফাইলগুলো হিডেন থাকতে পারে তোমার ফোন/কম্পিউটারে — GitHub-এর upload box-এ পুরো ZIP extract করা ফোল্ডার থেকে সিলেক্ট করলে এগুলো dot-ফাইল সহই উঠে যাবে
5. Commit message লিখে "Commit changes" চাপো

## Vercel-এ Deploy করার ধাপ

1. [vercel.com](https://vercel.com) → "Add New" → "Project"
2. তোমার GitHub repo সিলেক্ট করো (import)
3. Framework আপনাআপনি "Next.js" detect করবে — কিছু পরিবর্তন লাগবে না
4. **Environment Variables** section-এ গিয়ে `.env.example`-এ থাকা প্রতিটা key বসাও, value দিয়ো তোমার নতুন Firebase project থেকে (এখনো Firebase project না বানালে আগে banao Firebase Console-এ, তারপর সেখান থেকে config কপি করো)
5. "Deploy" চাপো

## পরের ধাপ

Phase 1 সম্পূর্ণ হলে (cinematic loading + 3D arrival scene), Phase 2 (Shop Exterior 3D scene) শুরু হবে। প্রতিটা ধাপ শেষে নতুন ZIP দেওয়া হবে যেটা শুধু changed/added ফাইলগুলো replace করে upload করলেই চলবে।

## যা এখনো করার বাকি (পরের ধাপে)

- Firebase project তৈরি করে `.env` values বসানো (তোমার দায়িত্ব — Console থেকে কপি করে আনতে হবে)
- Three.js দিয়ে আসল 3D scene (এখন placeholder আছে)
- Sound design integration
- বাকি সব phase (Phase 2 থেকে Phase 13)
