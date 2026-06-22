"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * ClientOnly wrapper — server-side rendering পুরোপুরি bypass করে।
 *
 * কেন দরকার:
 * - framer-motion 11 + Next.js 15 + Zustand 5 একসাথে SSR pass-এ
 *   "ReactCurrentBatchConfig" TypeError করে।
 * - hasMounted pattern page-level এ কাজ করে না কারণ dynamic import
 *   গুলো module evaluation time-এ crash করতে পারে।
 * - এই wrapper নিশ্চিত করে যে children শুধুমাত্র browser-এ render হয়।
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
