"use client";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/facebookPixel";
import { parseDescription } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import WishlistButton from "../wishlist/WishlistButton";
import ImageMagnifier from "./ImageMagnifier";
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
  variants?: any;
  selectedColor?: string;
}
export default function ProductMainSection({ 
  product,
  initialColor,
  onlyVariant
}: { 
  product: Product,
  initialColor?: string,
  onlyVariant?: boolean
}) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.size.length > 0 ? product.size[0] : undefined,
  );
  
  // Normalize initial color for Georgette
  const getInitialColor = () => {
    if (product.category === 'Georgette' && product.variants && initialColor) {
      const variants = product.variants as any[];
      const currentImageUrl = variants.find(v => v.combo === initialColor)?.imageUrl || product.imageUrl;
      const firstColor = variants.find(v => v.imageUrl === currentImageUrl)?.color;
      if (firstColor) return firstColor;
    }
    return initialColor || (product.color.length > 0 ? product.color[0] : undefined);
  };

  const [selectedColor, setSelectedColor] = useState<string | undefined>(getInitialColor);

  // Filter images if onlyVariant is true
  const displayImages = onlyVariant && selectedColor
    ? (product.images || []).filter((img) => img.color === selectedColor)
    : (product.images || []);

  // Use selected image as primary if in variant mode
  const currentImage = selectedColor
    ? (product.images || []).find((img) => img.color === selectedColor)?.url ||
      product.imageUrl
    : product.imageUrl;

  useEffect(() => {
    const pid = String(product.id).includes("--") ? String(product.id).split("--")[0] : String(product.id);
    trackEvent("ViewContent", {
      content_ids: [pid],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price,
      currency: "BDT",
      vendor: "tuhinscollection"
    });
  }, [product]);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = () => {
    if (product.hasVariants && product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.hasVariants && product.color.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    const variantId = product.category === 'Georgette' 
      ? `${product.id}--${selectedColor?.replace(/\s+/g, "-")}`
      : product.id;

    addItem({
      id: variantId,
      originalId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: currentImage,
      selectedSize,
      selectedColor,
    });

    const pid = String(product.id).includes("--") ? String(product.id).split("--")[0] : String(product.id);
    trackEvent("AddToCart", {
      content_ids: [pid],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price,
      currency: "BDT",
      vendor: "tuhinscollection"
    });

    toast.success(`${product.name} added to cart!`);
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };
  const currentReviewCount = (product.reviews || []).length;
  const averageRating =
    currentReviewCount > 0
      ? (product.reviews || []).reduce((acc: number, r: any) => acc + (r.rating || 0), 0) /
        currentReviewCount
      : 0;
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
        {}
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-50 rounded-xl overflow-hidden group">
          <ImageMagnifier
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500"
            containerClassName="relative w-full h-full overflow-hidden flex items-center justify-center cursor-none z-10"
          />
          {product.category && (
            <div className="absolute top-3 left-3 bg-brand-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-10">
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
              {parseDescription(product.description).description}
            </p>
          </div>
          <div className="flex items-center gap-4 py-4 border-y border-gray-200">
            <span className="text-3xl sm:text-4xl font-bold text-brand-600">
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
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                            selectedSize === s
                              ? "bg-brand-600 text-white border-brand-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
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
                    {product.category === 'Georgette' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Color: <span className="text-brand-600 font-bold">{selectedColor}</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(product.variants as any[] || [])
                              .filter((v: any) => v.imageUrl === (product.variants as any[] || []).find((varnt: any) => varnt.color === selectedColor)?.imageUrl)
                              .map((v: any) => (
                                <button
                                  key={v.color}
                                  onClick={() => setSelectedColor(v.color)}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-bold ${
                                    selectedColor === v.color
                                      ? "bg-brand-600 text-white border-brand-600 shadow-md"
                                      : "bg-white border-gray-100 text-gray-700 hover:border-brand-200"
                                  }`}
                                >
                                  {v.color}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Color ({product.color.length} available)
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-5 xl:grid-cols-6 gap-2">
                          {product.color.map((c) => {
                            const variantImg = product.images.find(img => img.color === c)?.url;
                            return (
                              <button
                                key={c}
                                onClick={() => setSelectedColor(c)}
                                title={c}
                                className={`relative aspect-square rounded-lg border-2 transition-all p-1 group overflow-hidden ${
                                  selectedColor === c
                                    ? "border-brand-600 ring-2 ring-gray-100"
                                    : "border-gray-100 hover:border-gray-900"
                                }`}
                              >
                                {variantImg && (
                                  <Image 
                                    src={variantImg} 
                                    alt={c} 
                                    fill 
                                    className="object-cover" 
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent" />
                                {selectedColor === c && (
                                  <div className="absolute top-0.5 right-0.5 bg-brand-600 rounded-full p-0.5 shadow-sm">
                                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {selectedColor && (
                          <p className="mt-2 text-xs font-medium text-blue-600">
                            Selected: <span className="text-gray-900">{selectedColor}</span>
                          </p>
                        )}
                      </>
                    )}
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
