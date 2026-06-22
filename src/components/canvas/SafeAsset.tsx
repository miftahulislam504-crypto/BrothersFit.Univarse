"use client";

import React from "react";

interface SafeAssetProps {
  /** Asset load fail করলে এটা দেখাবে — সাধারণত আগের procedural/preset ভার্সন */
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface SafeAssetState {
  hasError: boolean;
}

/**
 * Optional real asset (custom HDRI ফাইল, .glb model) load করার জন্য
 * Suspense-based drei loader (useGLTF, Environment files=) ব্যবহার
 * করলে ফাইল না থাকলে (404) পুরো scene crash করতে পারে। এই
 * ErrorBoundary সেটা ধরে fallback দেখায় — ফাইল থাকলে real asset,
 * না থাকলে আগের মতোই procedural/preset look, কোনো অবস্থাতেই site
 * ভাঙে না।
 *
 * ব্যবহার:
 *   <SafeAsset fallback={<Environment preset="lobby" />}>
 *     <Suspense fallback={<Environment preset="lobby" />}>
 *       <Environment files="/hdri/decor-shop.hdr" />
 *     </Suspense>
 *   </SafeAsset>
 */
export class SafeAsset extends React.Component<SafeAssetProps, SafeAssetState> {
  constructor(props: SafeAssetProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("[SafeAsset] ঐচ্ছিক asset load ব্যর্থ হয়েছে, fallback দেখানো হচ্ছে:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
