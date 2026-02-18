'use client';

import { trackEvent } from '@/lib/facebookPixel';
import { calculateDeliveryCharge, formatPrice } from '@cofounder/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Package, ShoppingCart, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { COLORS, SIZES } from '../constants';
import { CartItem, Product, ProductSize } from '../types';

interface CheckoutProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  initialProducts: Product[];
}

const getColorImage = (colorName: string, defaultImage: string) => {
  const color = COLORS.find(c => 
      c.name.toLowerCase() === colorName.toLowerCase() || 
      c.id.toLowerCase() === colorName.toLowerCase()
  );
  return color?.image || defaultImage;
};

const Checkout: React.FC<CheckoutProps> = ({ formRef, initialProducts }) => {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside' | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      trackEvent("ViewContent", {
        content_ids: initialProducts.map(p => p.id),
        content_type: 'product',
        content_category: "Men's Apparel",
        vendor: 'bengolsale'
      });
    }
  }, [initialProducts]);

  const flattenedProducts = React.useMemo(() => {
    const list: any[] = [];
    initialProducts.forEach(product => {
        if (product.isPack) {
            list.push({
                ...product,
                itemsCount: product.id.includes('6') ? 6 : 3 // Deduce from ID
            });
        } else if (product.hasVariants && product.variants?.stock) {
            Object.keys(product.variants.stock).forEach(color => {
                const type = product.name.replace(' T-shirt', '');
                list.push({
                    ...product,
                    displayName: `${color} T-shirt (${type})`,
                    internalId: `${product.id}-${color}`,
                    selectedColor: color,
                    imageUrl: getColorImage(color, product.imageUrl)
                });
            });
        }
    });
    return list;
  }, [initialProducts]);

  const totalQuantity = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = React.useMemo(() => {
    if (totalQuantity >= 6) {
        const packs = Math.floor(totalQuantity / 6);
        const remaining = totalQuantity % 6;
        return (packs * 1350) + (remaining * 250);
    }
    return totalQuantity * 250;
  }, [totalQuantity]);

  const isFreeDelivery = totalQuantity >= 3;
  const deliveryCharge = calculateDeliveryCharge(subtotal, deliveryArea, { isFree: isFreeDelivery });
  const total = subtotal + deliveryCharge;

  const addToCart = (product: Product, color: string, size: ProductSize) => {
    const stock = product.variants?.stock?.[color]?.[size] ?? 0;
    if (stock <= 0) {
        toast.error('This size is currently out of stock');
        return;
    }

    setSelectedItems(prev => {
        const existingItem = prev.find(item => item.productId === product.id && item.color === color && item.size === size);
        if (existingItem) {
            if (existingItem.quantity >= stock) {
                toast.error(`Only ${stock} items available in stock`);
                return prev;
            }
            return prev.map(item => 
                item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        
        const newItem: CartItem = {
            id: `${product.id}-${color}-${size}-${Date.now()}`,
            productId: product.id,
            name: (product as any).displayName || product.name,
            color,
            size,
            quantity: 1,
            price: product.price,
            imageUrl: getColorImage(color, product.imageUrl)
        };

        trackEvent("AddToCart", {
            content_ids: [product.id],
            content_name: product.name,
            content_category: "Men's Apparel",
            value: product.price,
            currency: "BDT"
        });

        return [...prev, newItem];
    });
  };

  const [loading, setLoading] = useState(false);

  const handleQuantity = (itemId: string, delta: number) => {
      setSelectedItems(prev => {
          const existingItem = prev.find(i => i.id === itemId);
          if (!existingItem) return prev;
          
          const product = products.find(p => p.id === existingItem.productId);
          const stock = product?.variants?.stock?.[existingItem.color!]?.[existingItem.size!] ?? 999;

          const newQty = Math.max(1, existingItem.quantity + delta);
          if (newQty > stock) {
              toast.error(`Only ${stock} items available in stock`);
              return prev;
          }

          return prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
      });
  };

  const handleRemove = (itemId: string) => {
      setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!deliveryArea) {
      toast.error('ডেলিভারি এরিয়া সিলেক্ট করুন');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    trackEvent("InitiateCheckout", {
      value: total,
      currency: "BDT",
      content_ids: [...new Set(selectedItems.map(p => p.productId))],
      content_category: "Men's Apparel"
    });

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            area: deliveryArea
          },
          items: selectedItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.size,
            selectedColor: item.color,
            imageUrl: item.imageUrl,
            metadata: item.isBundle ? { bundleItems: item.bundleItems } : null
          })),
          total,
          deliveryCharge
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
      
      toast.success('অর্ডার পাঠানো হয়েছে!');
      
      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        content_ids: [...new Set(selectedItems.map(item => item.productId))],
        content_category: "Men's Apparel",
        vendor: 'bengolsale'
      });

      setIsOrderSuccess(true);
      setSelectedItems([]);
      setFormData({ name: '', phone: '', address: '' });
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-bold">লোড হচ্ছে...</p>
      </div>
    );
  }

const ColorSelector: React.FC<{ product: Product, selectedColor: string, onSelect: (color: string) => void }> = ({ product, selectedColor, onSelect }) => {
    const colors = Object.keys(product.variants?.stock || {});
    if (colors.length === 0) return null;

    return (
        <div className="mb-2">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight flex items-center gap-1 mb-1">
                কালার
            </span>
            <div className="flex flex-wrap gap-1">
                {colors.map(color => (
                    <button
                        key={color}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelect(color); }}
                        className={`group relative px-2.5 py-1 rounded-md text-[9px] font-bold transition-all border ${
                            selectedColor === color
                            ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-brand-primary/30'
                        }`}
                    >
                        {color}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SizeSelector: React.FC<{ 
    product: Product, 
    color: string, 
    selectedSize: ProductSize | '', 
    onSelect: (size: ProductSize) => void 
}> = ({ product, color, selectedSize, onSelect }) => {
    const stock = product.variants?.stock?.[color] || {};
    
    return (
        <div className="flex flex-wrap gap-1">
            {SIZES.map(size => {
                const quantity = stock[size] ?? 0;
                const isOutOfStock = quantity <= 0;
                return (
                    <button
                        key={size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => { e.stopPropagation(); onSelect(size as ProductSize); }}
                        className={`group relative min-w-[2rem] h-6 rounded-md text-[9px] font-bold transition-all border flex items-center justify-center ${
                            selectedSize === size
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : isOutOfStock
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed grayscale'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-brand-primary/30'
                        }`}
                    >
                        {size}
                    </button>
                );
            })}
        </div>
    );
};

const ProductCard: React.FC<{ 
    product: Product & { displayName?: string, selectedColor?: string, internalId?: string }, 
    onAddToCart: (product: Product, color: string, size: ProductSize) => void 
}> = ({ product, onAddToCart }) => {
    const [localSize, setLocalSize] = useState<ProductSize | ''>('');
    const color = product.selectedColor || '';

    return (
        <div
            className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
        >
            <div className="relative bg-gray-50 aspect-square group/img overflow-hidden">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                />
            </div>
            
            <div className="p-2.5 flex flex-col">
                <h4 className="font-extrabold text-[12px] text-brand-dark leading-tight line-clamp-1 mb-2">{product.displayName || product.name}</h4>
                
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="shrink-0">
                        <span className="block font-black text-[13px] text-brand-primary leading-none">{formatPrice(product.price)}</span>
                        <span className="text-[9px] text-gray-300 line-through font-bold">{formatPrice(product.price + 50)}</span>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <SizeSelector product={product} color={color} selectedSize={localSize} onSelect={setLocalSize} />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (!localSize) {
                            toast.error('দয়া করে সাইজ সিলেক্ট করুন');
                            return;
                        }
                        onAddToCart(product, color, localSize as ProductSize);
                        setLocalSize('');
                    }}
                    className={`w-full h-8 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        localSize 
                        ? 'bg-brand-dark text-white hover:bg-brand-primary' 
                        : 'bg-brand-muted text-brand-dark'
                    }`}
                >
                    {localSize ? 'ADD TO CART' : 'SELECT SIZE'}
                </button>
            </div>
        </div>
    );
};

  return (
    <section className="py-20 relative overflow-hidden" id="checkout-section">
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Offers Banner - Compact with Readable Text */}
        <div className="mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-3 h-3 text-brand-primary fill-brand-primary" />
                <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest">সেরা অফারগুলো</h3>
                <Zap className="w-3 h-3 text-brand-primary fill-brand-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <div className="py-3 px-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 flex items-center justify-center gap-4 group transition-all hover:bg-brand-primary/10">
                    <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Package className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-brand-dark leading-tight uppercase">৩ পিস কিনুন</p>
                        <p className="text-xs text-brand-primary font-bold">ফ্রি ডেলিভারি!</p>
                    </div>
                </div>
                <div className="py-3 px-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 flex items-center justify-center gap-4 group transition-all hover:bg-brand-primary/10">
                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-brand-dark leading-tight uppercase">৬ পিস প্যাক</p>
                        <p className="text-xs text-brand-primary font-bold">মাত্র ১৩৫০৳ (সেরা ডিল)</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-16">

            {/* Standard Products Grid */}
            <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
                        কালার এবং সাইজ সিলেক্ট করুন
                    </h3>
                    <div className="h-px flex-1 bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {flattenedProducts.filter(p => !p.isPack).map((item) => (
                        <ProductCard key={item.internalId || item.id} product={item} onAddToCart={addToCart} />
                    ))}
                </div>
            </div>
          </div>

          {/* Sticky Checkout Panel */}
          <div className="lg:sticky lg:top-24" ref={formRef}>
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-3 sm:p-5 md:p-8 shadow-xl border border-gray-100 overflow-hidden relative">
              
              <AnimatePresence mode="wait">
              {isOrderSuccess ? (
                  <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-10"
                  >
                      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                          <Check className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-black text-brand-dark mb-2">ধন্যবাদ!</h2>
                      <p className="text-gray-500 text-sm mb-8">আপনার অর্ডারটি সফলভাবে রিসিভ করা হয়েছে।<br/>আমাদের প্রতিনিধি শীঘ্রই কল করবেন।</p>
                      
                      <button 
                          onClick={() => setIsOrderSuccess(false)}
                          className="bg-brand-muted text-gray-600 px-8 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
                      >
                          আরও অর্ডার করবেন?
                      </button>
                  </motion.div>
              ) : (
                  <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                  >
                      <h2 className="text-2xl font-black text-brand-dark mb-8">চেকআউট ফর্ম</h2>
                      
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input 
                          type="text" 
                          placeholder="আপনার নাম" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                        />
                        <input 
                          type="tel" 
                          placeholder="মোবাইল নাম্বার" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                        />
                        <textarea 
                          rows={2} 
                          placeholder="পূর্ণ ঠিকানা" 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                        />

                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <button type="button" onClick={() => setDeliveryArea('inside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'inside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>চট্টগ্রাম ({formatPrice(80)})</button>
                          <button type="button" onClick={() => setDeliveryArea('outside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'outside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>বাহিরে ({formatPrice(120)})</button>
                        </div>

                        {/* Bill Summary */}
                        <div className="bg-brand-dark rounded-[2rem] p-3 sm:p-5 md:p-8 mt-10 text-white shadow-2xl relative overflow-hidden group/card">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover/card:bg-brand-primary/20 transition-colors duration-700"></div>
                          
                          <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-6 flex items-center gap-2">
                              <Package className="w-3 h-3" />
                              আপনার অর্ডার সামারি ({totalQuantity})
                            </h3>

                            {/* Dynamic Incentives */}
                            <div className="mb-6 space-y-2">
                                {totalQuantity > 0 && totalQuantity < 3 && (
                                    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-3 flex items-center gap-3">
                                        <Package className="w-4 h-4 text-brand-primary shrink-0" />
                                        <p className="text-[10px] font-bold text-white leading-tight">
                                            আর <span className="text-brand-primary">{3 - totalQuantity}টি</span> যোগ করলে <span className="text-brand-primary">ফ্রি ডেলিভারি</span> পাবেন!
                                        </p>
                                    </div>
                                )}
                                {totalQuantity >= 3 && totalQuantity < 6 && (
                                    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-3 flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-brand-primary shrink-0" />
                                        <p className="text-[10px] font-bold text-white leading-tight">
                                            সাবাশ! আর <span className="text-brand-primary">{6 - totalQuantity}টি</span> যোগ করলে <span className="text-brand-primary">ধামাকা ডিসকাউন্ট</span> পাবেন!
                                        </p>
                                    </div>
                                )}
                                {totalQuantity >= 6 && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                        <p className="text-[10px] font-bold text-green-400 leading-tight">
                                            অভিনন্দন! আপনি সেরা ডিসকাউন্ট এবং ফ্রি ডেলিভারি আনলক করেছেন!
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-6 max-h-[40vh] sm:max-h-[350px] overflow-y-auto pr-1">
                              {selectedItems.map(item => (
                                  <div 
                                      key={item.id} 
                                      className="flex items-center gap-3 bg-white/5 p-2 sm:p-3 rounded-2xl text-white relative group border border-white/5 hover:border-white/10 transition-all"
                                  >
                                      <div className="w-12 h-12 rounded-xl bg-white shrink-0 overflow-hidden shadow-inner p-1">
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                          <p className="text-[11px] font-black leading-tight truncate">
                                              {item.name}
                                          </p>
                                          <p className="text-[11px] font-black shrink-0">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                                                                 <p className="text-[9px] text-gray-400 font-bold">
                                              Size: <span className="text-brand-primary">{item.size}</span>
                                              {item.color && <span className="ml-2">Color: <span className="text-brand-primary">{item.color}</span></span>}
                                          </p>
                                          
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-black/40 rounded-lg px-2 py-1 shrink-0">
                                                <button onClick={() => handleQuantity(item.id, -1)} className="text-white/60 hover:text-brand-primary px-1 font-bold text-[10px] transition">-</button>
                                                <span className="font-bold text-white w-3 text-center text-[10px]">{item.quantity}</span>
                                                <button onClick={() => handleQuantity(item.id, 1)} className="text-white/60 hover:text-brand-primary px-1 font-bold text-[10px] transition">+</button>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                className="text-white/20 hover:text-red-400 transition p-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {selectedItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                                  <ShoppingCart className="w-8 h-8 mb-2" />
                                  <p className="text-[10px]">পণ্য সিলেক্ট করুন...</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2 py-4 border-t border-white/5">
                                <div className="flex justify-between text-[11px] text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-gray-400">
                                    <span>Delivery Charge</span>
                                    <span className={isFreeDelivery ? 'text-brand-accent font-bold' : 'font-bold text-white'}>
                                      {isFreeDelivery ? 'FREE' : formatPrice(deliveryCharge)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 pt-4 border-t border-white/10 mt-2">
                                <div className="text-center sm:text-left">
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-1">Total Bill</span>
                                  <span className="text-2xl md:text-3xl font-black text-white leading-none">{formatPrice(total)}</span>
                                </div>
                                
                                <button 
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={selectedItems.length === 0 || isSubmitting}
                                    className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 uppercase tracking-widest"
                                >
                                  {isSubmitting ? 'Wait...' : 'Confirm'}
                                </button>
                            </div>
                          </div>
                        </div>
                      </form>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
