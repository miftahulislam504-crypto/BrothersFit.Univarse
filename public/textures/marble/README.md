# Marble Texture ফোল্ডার

এখনো এখানে কোনো ফাইল নেই — floor এখনো solid color (`#18181f`) + `MeshReflectorMaterial`-এর reflection দিয়ে চলছে, যেটা ইতিমধ্যে কাজ করছে। এখানে ফাইল যোগ করলে real marble pattern উপরে বসানো যাবে (reflection-এর সাথেই, একটা বাদ দিয়ে আরেকটা না)।

## কী ডাউনলোড করতে হবে

Poly Haven → **Marble 01**
https://polyhaven.com/a/marble_01

CC0, cream-beige tile, হালকা veining, low sheen — luxury floor reference ছবিগুলোর সাথে যায়।

## কীভাবে ডাউনলোড করবে (ফোনে)

1. উপরের লিংকে যাও।
2. **Resolution** = `1k` বাছো (8k না — floor texture বড় এলাকায় repeat হয়, 1k-ই যথেষ্ট, আর মোবাইলে অনেক হালকা)।
3. ডাউনলোড হবে একটা zip-এ কয়েকটা map (diffuse/albedo, normal, roughness)। অন্তত এই তিনটা দরকার।
4. এই ফোল্ডারে রাখো এই নামে:
   - `marble_01_diff.jpg` (রঙ/প্যাটার্ন)
   - `marble_01_nor.jpg` (normal map)
   - `marble_01_rough.jpg` (roughness map)

## এরপর কী

ফাইল রাখার পর আমাকে বলো — আমি `HallRoom.tsx`-এ `useTexture` দিয়ে এই তিনটা map লোড করে `MeshReflectorMaterial`-এ বসিয়ে দেব (graceful fallback সহ, যাতে ফাইল কোনো কারণে না পেলেও site ভেঙে না যায়)।
