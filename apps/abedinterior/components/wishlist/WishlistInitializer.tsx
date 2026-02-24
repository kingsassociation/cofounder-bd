"use client";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
export default function WishlistInitializer() {
  const { data: session } = useSession();
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const isInitialized = useWishlistStore((state) => state.isInitialized);
  useEffect(() => {
    if (session?.user && !isInitialized) {
      fetchWishlist();
    }
  }, [session, isInitialized, fetchWishlist]);
  return null;
}
