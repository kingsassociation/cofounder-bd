
"use client";

import { useEffect, useRef } from "react";

interface OrderTrackingProps {
  order: {
    id: string;
    total: number;
    items: any[];
  };
}

export default function OrderTracking({ order }: OrderTrackingProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Note: Purchase tracking has been moved to the CheckoutPage submission 
    // to ensure it only fires once and captures the exact conversion moment.
  }, [order?.id]);

  return null;
}
