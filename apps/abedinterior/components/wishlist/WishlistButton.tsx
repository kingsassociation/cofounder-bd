"use client";
import { trackEvent } from "@/lib/facebookPixel";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface WishlistButtonProps {
  productId: string;
  productName?: string;
  productPrice?: number;
  initialState?: boolean;
  className?: string;
  iconSize?: number;
}
export default function WishlistButton({
  productId,
  productName,
  productPrice,
  className = "",
  iconSize = 20,
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const inWishlist = useWishlistStore((state) => state.isInWishlist(productId));
  const toggleWishlistAction = useWishlistStore(
    (state) => state.toggleWishlist,
  );
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Please login to use wishlist");
      router.push("/sign-in");
      return;
    }
    try {
      await toggleWishlistAction(productId);
      if (!inWishlist) {
        const pid = String(productId).includes("--") ? String(productId).split("--")[0] : String(productId);
        trackEvent("AddToWishlist", {
          content_ids: [pid],
          content_name: productName,
          value: productPrice,
          currency: "BDT",
          vendor: "abedinterior"
        });
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };
  return (
    <button
      onClick={handleToggle}
      className={`transition-all hover:scale-110 active:scale-95 ${className} ${inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
      title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart
        size={iconSize}
        className={inWishlist ? "fill-current" : ""}
        strokeWidth={2}
      />
    </button>
  );
}
