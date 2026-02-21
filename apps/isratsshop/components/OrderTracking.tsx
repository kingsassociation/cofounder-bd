
"use client";

import { trackEvent } from "@/lib/facebookPixel";
import { useEffect } from "react";

interface OrderTrackingProps {
  order: {
    id: string;
    total: number;
    items: any[];
  };
}

export default function OrderTracking({ order }: OrderTrackingProps) {
  useEffect(() => {
    trackEvent("Purchase", {
      value: order.total,
      currency: "BDT",
      content_ids: order.items.map((item: any) => item.productId || item.product?.id),
      vendor: "tuhinscollectionsections"
    });
  }, [order]);

  return null;
}
