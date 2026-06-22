/**
 * @react-three/fiber v9 + React 19 + Next.js 15 type fix
 *
 * সমস্যা: R3F 9.x নিজেই `declare module 'react'` এর ভেতরে ThreeElements inject
 * করে, কিন্তু Next.js 15 JSX compilation এ `react/jsx-runtime` ব্যবহার করে।
 * এই chain-এ R3F-এর module augmentation automatic pick-up হয় না।
 *
 * সমাধান: এখানে explicitly `React.JSX.IntrinsicElements` augment করা হচ্ছে
 * project-level থেকে, যাতে সব canvas component-এ <points>, <bufferGeometry>,
 * <lineSegments>, <pointsMaterial> ইত্যাদি R3F elements TypeScript চিনতে পারে।
 */

import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

// Also augment react/jsx-runtime directly (Next.js 15 uses this transform)
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare module "react/jsx-dev-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
