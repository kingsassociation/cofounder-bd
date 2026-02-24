"use client";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/facebookPixel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageMagnifier from "./product/ImageMagnifier";
interface Product {
  id: string;
  originalId: string;
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
      originalId: product.originalId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedSize,
      selectedColor,
    });
    
    trackEvent("AddToCart", {
      content_ids: [product.originalId || product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BDT",
      vendor: "stylehuntbd"
    });

    toast.success(`${product.name} added to cart!`);
  };
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
      originalId: product.originalId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedSize,
      selectedColor,
    });

    trackEvent("AddToCart", {
      content_ids: [product.originalId || product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BDT",
      vendor: "stylehuntbd"
    });

    toast.success(`Processing your order for ${product.name}...`);
    onClose();
    setTimeout(() => {
      router.push("/cart");
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent("ViewContent", {
        content_ids: [product.originalId || product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: "BDT",
        vendor: "stylehuntbd"
      });
    }
  }, [isOpen, product]);

  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up flex flex-col pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Top Right Corner Inside */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hover:rotate-90 z-[80] border border-gray-100"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-4 md:p-8 overflow-y-auto flex-1">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative w-full aspect-square md:aspect-auto bg-gray-50 rounded-xl overflow-hidden group">
                <div className="relative w-full h-full min-h-[300px]">
                  <ImageMagnifier
                    src={selectedColor ? ((product as any).images || [])?.find((img: any) => img.color === selectedColor)?.url || product.imageUrl : product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    containerClassName="relative w-full h-full flex items-center justify-center cursor-none z-10"
                  />
                </div>
                {product.category && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                    {product.category}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-blue-600">
                    ৳{product.price.toFixed(2)}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>

                {product.hasVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4 border-t border-gray-100">
                    {product.size.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Select Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.size.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`px-3 py-1.5 rounded-lg border-2 transition-all font-bold text-xs ${
                                selectedSize === s
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                  : "bg-white border-gray-100 text-gray-600 hover:border-blue-200"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.color.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Select Color: <span className="text-gray-900">{selectedColor}</span>
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(product as any).images?.map((img: any) => (
                            <button
                              key={img.id}
                              onClick={() => setSelectedColor(img.color)}
                              className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                                selectedColor === img.color
                                  ? "border-blue-600 ring-2 ring-blue-50"
                                  : "border-gray-100 hover:border-blue-200"
                              }`}
                            >
                              <Image 
                                src={img.url} 
                                alt={img.color || "variant"} 
                                fill 
                                className="object-cover" 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className="bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.quantity === 0}
                    className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50"
                  >
                    Buy Now
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
