'use client';

import { trackEvent } from '@/lib/facebookPixel';
import { calculateDeliveryCharge, calculateSavings, formatPrice } from '@cofounder/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Package, Receipt, ShieldCheck, Star, Truck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { products, type ProductFamily, type ProductVariant } from '../data/products';

interface SelectedItem {
  productId: string;
  variant: ProductVariant;
  quantity: number;
}

interface CheckoutProps {
  initialProducts?: any[];
}

export default function Checkout({ initialProducts }: CheckoutProps) {
  const displayProducts = initialProducts?.length ? initialProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.imageUrl,
    category: p.category,
    variants: p.variants as any[]
  })) : products;

  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside' | null>('inside');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    if (displayProducts.length > 0) {
      trackEvent("ViewContent", {
        content_ids: displayProducts.map(p => p.id),
        content_type: 'product',
        content_category: 'Dates & Fruits',
        vendor: 'fruits-zone'
      });
    }
  }, [displayProducts]);
  
  const formRef = useRef<HTMLDivElement>(null);

  const activeItems = Object.values(selectedItems);
  const subtotal = activeItems.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0);
  
  const isFreeDelivery = subtotal >= 5000 || activeItems.some(item => item.variant.weight.includes('3kg') || item.variant.weight.includes('5kg'));
  
  const deliveryCharge = calculateDeliveryCharge(subtotal, deliveryArea, { isFree: isFreeDelivery });
  const total = subtotal + deliveryCharge;

  const handleSelect = (product: ProductFamily, variant: ProductVariant) => {
    const key = `${product.id}-${variant.weight}`;
    setSelectedItems(prev => {
      if (prev[key]) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      trackEvent("AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_category: 'Dates & Fruits',
        value: variant.price,
        currency: "BDT"
      });
      return {
        ...prev,
        [key]: { productId: product.id, variant, quantity: 1 }
      };
    });
  };

  const handleQuantity = (product: ProductFamily, variant: ProductVariant, delta: number) => {
    const key = `${product.id}-${variant.weight}`;
    setSelectedItems(prev => {
      const item = prev[key];
      if (!item) {
        // If item doesn't exist, add it with initial quantity
        if (delta > 0) {
          return {
            ...prev,
            [key]: { productId: product.id, variant, quantity: 1 }
          };
        }
        return prev;
      }
      const newQty = Math.max(0, item.quantity + delta);
      if (newQty === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [key]: { ...item, quantity: newQty }
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('পূর্ণ ঠিকানা ও মোবাইল নাম্বার দিন');
      return;
    }
    if (!deliveryArea) {
      toast.error('চট্টগ্রাম এর ভিতরে না কি বাহিরে সিলেক্ট করুন');
      return;
    }
    if (activeItems.length === 0) {
      toast.error('অর্ডার করতে অন্তত একটি পণ্য বাছাই করুন');
      return;
    }

    trackEvent("InitiateCheckout", {
      value: total,
      currency: "BDT",
      content_ids: activeItems.map(item => item.productId),
      content_category: 'Dates & Fruits'
    });

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            area: deliveryArea
          },
          items: activeItems.map(item => {
            const product = displayProducts.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              name: product?.name || 'Unknown Product',
              price: item.variant.price,
              quantity: item.quantity,
              selectedSize: item.variant.weight,
              imageUrl: product?.image
            };
          }),
          total,
          deliveryCharge
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      
      setIsOrderSuccess(true);
      setSelectedItems({});
      setFormData({ name: '', phone: '', address: '' });
      toast.success('অর্ডার পাঠানো হয়েছে!');

      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        content_ids: activeItems.map(item => item.productId),
        content_category: 'Dates & Fruits',
        vendor: 'fruits-zone'
      });
    } catch (error: any) {
      toast.error(error.message || 'অর্ডার করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout" className="py-12 bg-mesh relative overflow-hidden">
      <div className="absolute inset-0 pattern-islamic opacity-30 pointer-events-none" />
      <div className="container mx-auto px-1 sm:px-2">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary mb-6">
             আমাদের প্রিমিয়াম খেজুর সংগ্রহ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 tracking-tight text-brand-primary">
            ইফতারের সেরা <span className="text-brand-accent">তৃপ্তি</span>
          </h2>
          <p className="text-brand-text/60 max-w-xl mx-auto font-bold text-sm md:text-base leading-relaxed">
            সৌদি আরব ও বিশ্বের সেরা বাগান থেকে সংগৃহীত। ১০০% প্রাকৃতিক ও কেমিক্যাল মুক্ত।
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Product Grid */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12 md:space-y-16">
              {displayProducts.map((product) => {
                 const hasVariants = product.variants && product.variants.length > 0;
                 // Default to 1kg variant or first available
                 const defaultVariant = hasVariants ? (product.variants.find(v => v.weight === '1kg') || product.variants[0]) : { price: 0, weight: 'N/A' } as ProductVariant;
                 
                 // Check if ANY variant of this product is selected (simplified for single-variant UI)
                 const selectedVariantKey = Object.keys(selectedItems).find(key => key.startsWith(`${product.id}-`));
                 const isSelected = !!selectedVariantKey;
                 const quantity = selectedVariantKey ? selectedItems[selectedVariantKey].quantity : 0;
                 
                 return (
                   <motion.div 
                     key={product.id} 
                     onClick={() => {
                        if (!isSelected) {
                           handleSelect(product, defaultVariant);
                        }
                     }}
                     className={`glass-card rounded-xl md:rounded-[3rem] p-3 sm:p-6 md:p-12 transition-all duration-300 overflow-hidden group relative cursor-pointer border-2 ${
                         isSelected 
                         ? 'border-brand-primary bg-brand-primary/5 shadow-xl shadow-brand-primary/10' 
                         : 'border-transparent hover:border-brand-primary/20 hover:bg-white/50'
                     }`}
                  >
                     <div className="flex flex-row gap-2 sm:gap-4 md:gap-8 items-center">
                        {/* Premium Badge */}
                        <div className="absolute top-0 right-0 bg-brand-accent text-white text-[6px] sm:text-[10px] font-black uppercase tracking-[0.05em] px-1.5 py-0.5 sm:px-4 sm:py-1.5 rounded-bl-lg sm:rounded-bl-xl shadow-lg z-20">
                          Premium
                        </div>

                        {/* Image */}
                        <div className="w-16 h-16 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg sm:rounded-[2rem] bg-brand-muted/30 flex items-center justify-center border border-brand-muted/50 overflow-hidden shrink-0 relative group-hover:bg-brand-primary/5 transition-colors duration-700">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                           {isSelected && (
                                <div className="absolute top-2 left-2 bg-brand-primary text-white p-1 rounded-full shadow-lg z-10">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={3} />
                                </div>
                           )}
                        </div>
                                                {/* Content */}
                         <div className="flex-1 min-w-0 py-1 sm:py-2 md:py-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-3 sm:mb-4">
                               <div>
                                  <h3 className="text-sm sm:text-2xl md:text-3xl font-black text-brand-primary tracking-tight truncate">{product.name}</h3>
                                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                                     <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-brand-accent text-brand-accent" />)}
                                     </div>
                                     <span className="text-[8px] sm:text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Verified</span>
                                  </div>
                               </div>
                               
                               <div className="flex items-baseline gap-2 mt-1 sm:mt-0">
                                     <span className="text-lg sm:text-2xl md:text-3xl font-black text-brand-accent">{formatPrice(defaultVariant.price)}</span>
                                     <span className="text-xs sm:text-sm font-bold text-brand-primary/40 uppercase tracking-wider">/ kg</span>
                               </div>
                            </div>
                            
                             <p className="text-[10px] sm:text-sm text-brand-text/70 leading-relaxed font-bold line-clamp-2 mb-4 sm:mb-6">
                                 {product.description || `সেরা মানের পুষ্টিকর ${product.name} খেজুর`}
                             </p>
                             
                             {/* Quantity Controls */}
                             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                {!isSelected ? (
                                   <div className="px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs bg-brand-primary/10 text-brand-primary border-2 border-brand-primary/20 pointer-events-none whitespace-nowrap">
                                      ঝুড়িতে নিন
                                   </div>
                                ) : (
                                   <div className="px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs bg-brand-primary text-white shadow-lg pointer-events-none whitespace-nowrap">
                                      ঝুড়িতে আছে
                                   </div>
                                )}
                                
                                {isSelected && (
                                   <div className="flex items-center gap-2 sm:gap-3 bg-white/50 rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-4 sm:py-2 border-2 border-brand-primary/20">
                                      <button
                                         onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuantity(product, defaultVariant, -1);
                                         }}
                                         className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-black rounded-lg transition-all text-sm"
                                      >
                                         −
                                      </button>
                                      <div className="flex flex-col items-center min-w-[45px] sm:min-w-[60px]">
                                         <span className="text-lg sm:text-xl font-black text-brand-primary">{quantity}</span>
                                         <span className="text-[9px] font-bold text-brand-primary/40 uppercase tracking-wider">kg</span>
                                      </div>
                                      <button
                                         onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuantity(product, defaultVariant, 1);
                                         }}
                                         className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-black rounded-lg transition-all text-sm"
                                      >
                                         +
                                      </button>
                                   </div>
                                )}
                             </div>
                          </div>
                      </div>
                   </motion.div>
                );
              })}
          </div>

          <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-24" ref={formRef}>
             <div className="glass-card rounded-xl md:rounded-[3rem] p-3 sm:p-4 md:p-8 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                   {isOrderSuccess ? (
                     <motion.div 
                         key="success"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.05 }}
                         className="flex flex-col items-center text-center py-6"
                     >
                         <div className="w-20 h-20 bg-brand-primary text-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-brand-primary/20">
                             <ShieldCheck size={40} strokeWidth={1.5} />
                         </div>
                         <h2 className="text-3xl font-black text-brand-primary mb-4">অর্ডার সফল হয়েছে</h2>
                         <p className="text-base text-brand-primary/60 font-bold mb-10 leading-relaxed">ধন্যবাদ! আমাদের প্রতিনিধি খুব শীঘ্রই আপনার ঠিকানায় যোগাযোগ করবেন।</p>
                         <button 
                             onClick={() => setIsOrderSuccess(false)}
                             className="w-full h-16 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all active:scale-[0.98]"
                         >
                             আরও পণ্য দেখুন
                         </button>
                     </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                       <header className="flex items-center justify-between">
                          <div>
                             <p className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Checkout Pipeline</p>
                             <h2 className="text-xl sm:text-2xl font-black text-brand-primary tracking-tighter">অর্ডার তথ্য দিন</h2>
                          </div>
                          <div className="p-2 sm:p-3 bg-brand-muted/20 rounded-xl sm:rounded-2xl border border-brand-muted">
                             <Receipt size={16} className="text-brand-text/20 sm:w-5 sm:h-5" />
                          </div>
                       </header>

                       <div className="space-y-6">
                           <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-6 bg-brand-primary/10 rounded-2xl sm:rounded-3xl border border-brand-primary/20">
                              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-primary shadow-lg shrink-0">
                                 <Truck size={20} className="sm:w-6 sm:h-6" />
                              </div>
                              <p className="text-[10px] sm:text-xs font-bold text-brand-primary leading-tight uppercase tracking-wider sm:tracking-widest">
                                 ইফতারের আগে দ্রুততম <span className="text-brand-accent">প্রিমিয়াম ডেলিভারি</span> নিশ্চিয়তা!
                              </p>
                           </div>

                           <div className="grid grid-cols-1 gap-5">
                              <input 
                                type="text" 
                                placeholder="আপনার পূর্ণ নাম" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full h-14 sm:h-18 bg-white/50 border-2 border-brand-muted focus:border-brand-primary/50 rounded-xl sm:rounded-2xl px-4 sm:px-8 text-sm font-bold text-brand-primary focus:outline-none transition-all placeholder:text-brand-primary/30"
                              />
                              <input 
                                type="tel" 
                                placeholder="সচল মোবাইল নাম্বার" 
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full h-14 sm:h-18 bg-white/50 border-2 border-brand-muted focus:border-brand-primary/50 rounded-xl sm:rounded-2xl px-4 sm:px-8 text-sm font-bold text-brand-primary focus:outline-none transition-all placeholder:text-brand-primary/30"
                              />
                              <textarea 
                                rows={3}
                                placeholder="আপনার বিস্তারিত ঠিকানা" 
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="w-full bg-white/50 border-2 border-brand-muted focus:border-brand-primary/50 rounded-xl sm:rounded-2xl px-4 sm:px-8 py-4 sm:py-6 text-sm font-bold text-brand-primary focus:outline-none transition-all placeholder:text-brand-primary/30 resize-none"
                              />
                           </div>

                           <div className="flex gap-2 sm:gap-4 p-1.5 sm:p-2 bg-brand-muted/20 rounded-2xl sm:rounded-3xl border border-brand-muted/50">
                              <button type="button" onClick={() => setDeliveryArea('inside')} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all ${deliveryArea === 'inside' ? 'bg-white text-brand-primary shadow-xl ring-2 ring-brand-primary/10' : 'text-brand-text/30 hover:bg-white/50'}`}>চট্টগ্রাম ({formatPrice(80)})</button>
                              <button type="button" onClick={() => setDeliveryArea('outside')} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all ${deliveryArea === 'outside' ? 'bg-white text-brand-primary shadow-xl ring-2 ring-brand-primary/10' : 'text-brand-text/30 hover:bg-white/50'}`}>বাহিরে ({formatPrice(120)})</button>
                           </div>
                       </div>
                       
                       {/* High-Fidelity "Digital Receipt" Summary */}
                       <div className="bg-brand-primary rounded-xl sm:rounded-[2rem] p-4 sm:p-6 text-white relative overflow-hidden shadow-xl">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-full h-2 bg-[radial-gradient(circle_at_center,_#fff_0,_transparent_70%)] opacity-10" />
                          
                          <div className="relative z-10 space-y-5">
                             <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Digital Receipt</h3>
                                <time className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{new Date().toLocaleDateString()}</time>
                             </div>

                             <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar-white">
                                {activeItems.map((item) => {
                                  const product = displayProducts.find(p => p.id === item.productId);
                                  const key = `${item.productId}-${item.variant.weight}`;
                                  return (
                                     <motion.div 
                                         key={key} 
                                         layout
                                         className="flex items-center gap-6 group/item"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 shrink-0 border border-white/5">
                                            <img src={product?.image} alt={product?.name} className="w-full h-full object-contain" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-xs font-black uppercase tracking-tight text-white/90 truncate mr-4">{product?.name}</p>
                                                <button onClick={() => handleSelect(product as any, item.variant)} className="text-white/20 hover:text-white/50 transition-colors"><X size={14} /></button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item.variant.weight} × {item.quantity}</p>
                                                <p className="text-sm font-black text-brand-accent">{formatPrice(item.variant.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                     </motion.div>
                                  );
                                })}
                                {activeItems.length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-10 opacity-20 italic">
                                     <Package size={32} strokeWidth={1} className="mb-4" />
                                     <p className="text-[10px] font-black uppercase tracking-widest">খালি ঝুড়ি</p>
                                  </div>
                                )}
                             </div>

                             <div className="space-y-4 pt-10 border-t border-white/10">
                                <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                    <span>Subtotal</span>
                                    <span className="text-white/80">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                    <span>Shipping</span>
                                    <span className={isFreeDelivery ? 'text-brand-accent' : 'text-white/80'}>
                                        {isFreeDelivery ? 'Complimentary' : formatPrice(deliveryCharge)}
                                    </span>
                                </div>
                                
                                {activeItems.some(i => i.variant.oldPrice) && (
                                   <div className="flex justify-between text-[11px] font-black text-brand-accent uppercase tracking-[0.2em] bg-white/5 py-3 px-4 rounded-xl">
                                      <span>Ramadan Savings</span>
                                      <span>-{formatPrice(calculateSavings(activeItems.map(i => ({ 
                                        price: i.variant.price, 
                                        oldPrice: i.variant.oldPrice, 
                                        quantity: i.quantity 
                                      }))))}</span>
                                   </div>
                                )}

                                <div className="flex justify-between items-end pt-4 mt-2">
                                   <div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Total Amount</p>
                                      <span className="text-2xl sm:text-4xl font-black text-white leading-none tracking-tighter">{formatPrice(total)}</span>
                                   </div>
                                   
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={activeItems.length === 0 || isSubmitting}
                                        className="h-14 px-8 bg-brand-accent text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-accent/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                                    >
                                      {isSubmitting ? 'প্রসেসিং...' : 'কার্টে যোগ করুন'}
                                    </button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar-white::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-white::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar-white::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </section>
  );
}
