
"use client";

import { trackEvent } from "@/lib/facebookPixel";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchTracking() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      trackEvent("Search", {
        search_string: query,
        vendor: "abedinterior"
      });
    }
  }, [query]);

  return null;
}
