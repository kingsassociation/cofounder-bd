"use client";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/facebookPixel";
import { parseDescription } from "@/lib/utils";
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
  const [quantity, setQuantity] = useState(10);
  const router = useRouter();
  const { items, addItem } = useCartStore();

  const totalCartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // If cart already has items, default new add to 1
    // If cart is empty, default to 10 to help user meet minimum
    if (totalCartQuantity > 0) {
      setQuantity(1);
    } else {
      setQuantity(10);
    }
  }, [totalCartQuantity]);

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
      quantity,
    });

    trackEvent("AddToCart", {
      content_ids: [product.originalId || product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price * quantity,
      currency: "BDT",
      vendor: "abedinterior"
    });

    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent("ViewContent", {
        content_ids: [product.originalId || product.id],
        content_name: product.name,
        content_category: product.category,
        content_type: "product",
        value: product.price,
        currency: "BDT",
        vendor: "abedinterior"
      });
    }
  }, [isOpen, product]);

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
      quantity,
    });

    trackEvent("AddToCart", {
      content_ids: [product.originalId || product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price * quantity,
      currency: "BDT",
      vendor: "abedinterior"
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up flex flex-col pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hover:rotate-90 z-[60] border border-gray-100"
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
          {}
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {}
              <div className="relative w-full h-56 md:h-full md:min-h-[300px] bg-gray-50 rounded-lg overflow-hidden group">
                <div className="relative w-full h-full">
                  <ImageMagnifier
                    src={selectedColor ? ((product as any).images || [])?.find((img: any) => img.color === selectedColor)?.url || product.imageUrl : product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-500"
                    containerClassName="relative w-full h-full overflow-hidden flex items-center justify-center cursor-none z-10"
                  />
                </div>
                {product.category && (
                  <div className="absolute top-4 left-4 bg-brand-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
                    {product.category}
                  </div>
                )}
                {/* Variant Label */}
                {selectedColor && (
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-brand-600 shadow-sm z-10 border border-gray-100">
                    {selectedColor}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Hover to zoom
                </div>
              </div>
              {}
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                  {parseDescription(product.description).description}
                </p>
                {}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-brand-600">
                    ৳{product.price.toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>
                {}
                {product.hasVariants && (
                  <div className="space-y-4 py-4 border-t">
                    {/* Size Selector */}
                    {product.size.length > 0 && (
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                          Select Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.size.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-semibold ${
                                selectedSize === s
                                  ? "bg-brand-600 text-white border-brand-600 shadow-md transform scale-105"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-900"
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
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                          Select Color: <span className="text-gray-900">{selectedColor}</span>
                        </label>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                          {(product as any).images?.map((img: any) => (
                            <button
                              key={img.id}
                              onClick={() => setSelectedColor(img.color)}
                              className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden group ${
                                selectedColor === img.color
                                  ? "border-brand-600 ring-2 ring-gray-100"
                                  : "border-gray-100 hover:border-brand-200"
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
                                <div className="absolute top-0.5 right-0.5 bg-brand-600 rounded-full p-0.5 shadow-sm z-10">
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
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Quantity (Rolls)
                      </label>
                      <span className="text-xs text-neutral-500">Min 10 rolls total</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-lg font-bold hover:border-brand-600 transition-colors"
                      > - </button>
                      <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-200 rounded-lg font-bold hover:border-brand-600 transition-colors"
                      > + </button>
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Cart Progress</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{totalCartQuantity} / 10 Rolls</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${totalCartQuantity >= 10 ? 'bg-green-500' : 'bg-brand-600'}`}
                        style={{ width: `${Math.min(100, (totalCartQuantity / 10) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium">
                      {totalCartQuantity >= 10 
                        ? "✓ Minimum requirement met! You can checkout now." 
                        : `Mix & match designs! Add ${10 - totalCartQuantity} more rolls to checkout.`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-brand-100 disabled:opacity-50"
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
