"use client";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string | null;
  size: string[];
  color: string[];
  selectedColor?: string;
  hasVariants: boolean;
}
interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}
export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.size.length > 0 ? product.size[0] : undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.selectedColor || (product.color.length > 0 ? product.color[0] : undefined),
  );
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const handleBuyNow = () => {
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
      imageUrl: product.imageUrl,
      selectedSize,
      selectedColor,
    });
    toast.success(`${product.name} added to cart!`);
    onClose();
    setTimeout(() => {
      router.push("/cart");
    }, 300);
  };
  if (!isOpen) return null;
  return (
    <>
      {}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      ></div>
      {}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-slide-up flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {}
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {}
              <div className="relative w-full h-56 md:h-full md:min-h-[300px] bg-gray-50 rounded-lg overflow-hidden group">
                <div className="relative w-full h-full cursor-zoom-in">
                  <Image
                    src={selectedColor ? ((product as any).images || [])?.find((img: any) => img.color === selectedColor)?.url || product.imageUrl : product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-150"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {product.category && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                    {product.category}
                  </div>
                )}
                {/* Variant Label */}
                {selectedColor && (
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-blue-600 shadow-sm z-10 border border-blue-100">
                    {selectedColor}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Hover to zoom
                </div>
              </div>
              {}
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                  {product.description}
                </p>
                {}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ৳{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.quantity > 0
                      ? `${product.quantity} in stock`
                      : "Out of stock"}
                  </span>
                </div>
                {}
                {product.hasVariants && (
                  <div className="space-y-4 py-4 border-t">
                    {/* Size Selector */}
                    {product.size.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-tight">
                          Select Size:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.size.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-semibold ${
                                selectedSize === s
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selector with Thumbnails for many colors */}
                    {product.color.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-tight">
                          Select Color ({product.color.length}): {selectedColor && <span className="text-blue-600 normal-case ml-1 font-medium">{selectedColor}</span>}
                        </label>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                          {(product as any).images?.map((img: any) => (
                            <button
                              key={img.id}
                              onClick={() => setSelectedColor(img.color)}
                              className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden group ${
                                selectedColor === img.color
                                  ? "border-blue-600 ring-2 ring-blue-100"
                                  : "border-gray-100 hover:border-blue-300"
                              }`}
                              title={img.color || "Product variant"}
                            >
                              <Image 
                                src={img.url} 
                                alt={img.color || "variant"} 
                                fill 
                                className="object-cover" 
                              />
                              {selectedColor === img.color && (
                                <div className="absolute top-0.5 right-0.5 bg-blue-600 rounded-full p-0.5 shadow-sm z-10">
                                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {}
                <div className="flex gap-2 pt-3 mt-auto">
                  <button
                    onClick={handleBuyNow}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
