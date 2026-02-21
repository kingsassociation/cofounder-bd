
"use client";

import { trackEvent } from "@/lib/facebookPixel";
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
    if (order && !hasTracked.current && order.items?.length > 0) {
      const contentIds = order.items
        .map((item: any) => item.productId || item.product?.id)
        .filter(Boolean);

      trackEvent("Purchase", {
        value: order.total,
        currency: "BDT",
        content_ids: contentIds,
        content_type: "product",
        num_items: order.items.reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0,
        ),
        vendor: "stylehuntbd",
      });
      hasTracked.current = true;
    }
  }, [order]);

  return null;
}
