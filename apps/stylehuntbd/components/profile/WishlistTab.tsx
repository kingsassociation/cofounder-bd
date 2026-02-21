"use client";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };
  createdAt: string;
}
export default function WishlistTab() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchWishlist();
  }, []);
  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/user/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };
  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.filter((item) => item.product.id !== productId),
        );
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
          <ShoppingBag size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Your wishlist is empty
        </h3>
        <p className="text-gray-500 mt-1 mb-6">
          Save items you want to buy later.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group relative"
        >
          <Link
            href={`/shop/${item.product.id}`}
            className="block flex-shrink-0"
          >
            <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <Link href={`/shop/${item.product.id}`}>
              <h4 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                {item.product.name}
              </h4>
            </Link>
            <p className="text-blue-600 font-bold mt-1">
              ৳{item.product.price.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-1 font-medium ${item.product.quantity > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {item.product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <button
            onClick={() => removeFromWishlist(item.product.id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
