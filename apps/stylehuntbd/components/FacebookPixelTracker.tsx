"use client";

import { trackEvent } from "@/lib/facebookPixel";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Force a PageView on every route change
    trackEvent("PageView");
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixelTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
