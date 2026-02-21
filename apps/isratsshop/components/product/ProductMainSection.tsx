"use client";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/facebookPixel";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import WishlistButton from "../wishlist/WishlistButton";
interface ProductImage {
  id: string;
  url: string;
  color: string | null;
}
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
  category: string | null;
  size: string[];
  color: string[];
  hasVariants: boolean;
  reviews: any[];
  images: ProductImage[];
}
export default function ProductMainSection({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.size.length > 0 ? product.size[0] : undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.color.length > 0 ? product.color[0] : undefined,
  );

  useEffect(() => {
    trackEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: "BDT",
      vendor: "tuhinscollections"
    });
  }, [product]);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const currentImage = selectedColor
    ? product.images.find((img) => img.color === selectedColor)?.url ||
      product.imageUrl
    : product.imageUrl;
  const handleAddToCart = () => {
    if (product.hasVariants && product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.hasVariants && product.color.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: currentImage,
      selectedSize,
      selectedColor,
    });

    trackEvent("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: "BDT"
    });

    toast.success(`${product.name} added to cart!`);
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };
  const currentReviewCount = product.reviews.length;
  const averageRating =
    currentReviewCount > 0
      ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
        currentReviewCount
      : 0;
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
        {}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden group">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-125 cursor-zoom-in"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.category && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10">
              {product.category}
            </div>
          )}
          <WishlistButton
            productId={product.id}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg z-10 hover:bg-white transition-all transform hover:scale-110"
            iconSize={24}
          />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Hover to zoom
          </div>
        </div>
        {}
        <div className="flex flex-col justify-center space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            {}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({averageRating.toFixed(1)}) {currentReviewCount} reviews
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="flex items-center gap-4 py-4 border-y border-gray-200">
            <span className="text-3xl sm:text-4xl font-bold text-blue-600">
              ৳{product.price.toFixed(2)}
            </span>
            {product.quantity > 0 ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                In Stock ({product.quantity})
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>
          {}
          <div className="space-y-6 pt-2">
            {product.hasVariants && (
              <div className="space-y-4">
                {product.size.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedSize === s
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.color.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.color.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedColor === c
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <div>
                <span className="block font-semibold text-gray-900">
                  Free Shipping
                </span>
                <span className="text-gray-500">On orders over ৳5000</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                />
              </svg>
              <div>
                <span className="block font-semibold text-gray-900">
                  Easy Returns
                </span>
                <span className="text-gray-500">30 day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
