"use client";
import { parseDescription } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import WishlistButton from "./wishlist/WishlistButton";
interface Product {
  id: string; // This is the virtual id: originalId--color
  originalId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string | null;
  size: string[];
  selectedColor: string;
  color: string[];
  hasVariants: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rating = 4.5;
  
  // Link to the real product page with the color pre-selected
  const productLink = `/shop/${product.originalId}?color=${encodeURIComponent(product.selectedColor)}&variant=true`;

  return (
    <>
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full group relative"
      >
        {/* Link wraps the image */}
        <Link
          href={productLink}
          className="block relative bg-gray-50 w-full h-52 sm:h-56 md:h-64 overflow-hidden"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="group-hover:scale-110 transition-transform duration-500 object-contain p-1"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.category && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
              {product.category}
            </div>
          )}
          <WishlistButton
            productId={product.id}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm z-10 hover:bg-white"
            iconSize={18}
          />
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="p-3 sm:p-4">
          <Link href={productLink}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors mb-1">
              {product.name}
            </h3>
          </Link>
          {}
          <p className="text-xs sm:text-sm text-gray-500 truncate mb-2">
            {parseDescription(product.description).summary}
          </p>
          {}
          {}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {rating}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    index < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <p className="text-lg sm:text-xl font-bold text-blue-600">
              ৳{product.price.toFixed(2)}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={product.quantity === 0}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
