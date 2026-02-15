'use client';

import { trackEvent } from '@/lib/facebookPixel';
import { calculateDeliveryCharge, formatPrice } from '@cofounder/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Package, ShoppingCart, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SIZES } from '../constants';
import { ProductSize } from '../types';

interface CheckoutProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  initialProducts: any[];
}

const Checkout: React.FC<CheckoutProps> = ({ formRef, initialProducts }) => {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, { size: ProductSize, quantity: number }>>({});
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

  const selectedIds = Object.keys(selectedItems);
  const activeProducts = products.filter(p => selectedIds.includes(p.id));
  
  const subtotal = activeProducts.reduce((acc, curr) => acc + (curr.price * selectedItems[curr.id].quantity), 0);
  
  const hasPack = activeProducts.some(item => item.isPack);
  const singleItemCount = activeProducts
    .filter(item => !item.isPack)
    .reduce((acc, curr) => acc + selectedItems[curr.id].quantity, 0);

  const isFreeDelivery = hasPack || singleItemCount >= 3;
  
  const deliveryCharge = calculateDeliveryCharge(subtotal, deliveryArea, { isFree: isFreeDelivery });
  const total = subtotal + deliveryCharge;

  const handleSelect = (productId: string, size: ProductSize) => {
      setSelectedItems(prev => ({
          ...prev,
          [productId]: { ...prev[productId], size, quantity: prev[productId]?.quantity || 1 }
      }));
  };

  const handleQuantity = (productId: string, delta: number) => {
      setSelectedItems(prev => {
          const item = prev[productId];
          if (!item) return prev;
          const newQty = Math.max(1, item.quantity + delta);
          return {
              ...prev,
              [productId]: { ...item, quantity: newQty }
          };
      });
  };

  const handleRemove = (productId: string) => {
      setSelectedItems(prev => {
          const newItems = { ...prev };
          delete newItems[productId];
          return newItems;
      });
  };

  const toggleSelection = (product: any) => {
      if (selectedItems[product.id]) {
          handleRemove(product.id);
      } else {
          trackEvent("AddToCart", {
            content_ids: [product.id],
            content_name: product.name,
            content_category: "Men's Apparel",
            value: product.price,
            currency: "BDT"
          });
          handleSelect(product.id, 'M');
      }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!deliveryArea) {
      toast.error('ডেলিভারি এরিয়া সিলেক্ট করুন');
      return;
    }
    if (activeProducts.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    trackEvent("InitiateCheckout", {
      value: total,
      currency: "BDT",
      content_ids: activeProducts.map(p => p.id),
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
          items: activeProducts.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: selectedItems[item.id].quantity,
            selectedSize: selectedItems[item.id].size,
            imageUrl: item.imageUrl
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
        content_ids: activeProducts.map(item => item.id),
        content_category: "Men's Apparel",
        vendor: 'bengolsale'
      });

      setIsOrderSuccess(true);
      setSelectedItems({});
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

  return (
    <section id="checkout" className="py-12 md:py-24 bg-brand-muted overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-brand-dark mb-4">আপনার প্যাকটি বাছাই করুন</h2>
          <p className="text-gray-500 text-sm">প্যাক বা সিঙ্গেল টি-শার্ট সিলেক্ট করুন এবং নিজের সাইজ বেছে নিন</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-12">
            
            <div>
              <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] mb-6 ml-0 sm:ml-2">Value Packs (সেরা অফার)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
                {products.filter(c => c.isPack).map((combo) => (
                  <div
                    key={combo.id}
                    className={`group relative w-full min-w-0 max-w-full overflow-hidden text-left p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] transition-all duration-300 shadow-sm border border-gray-100 ${
                      selectedItems[combo.id] ? 'bg-white shadow-[inset_0_0_0_2px_#F97316]' : 'bg-white/50'
                    }`}
                  >
                    <div onClick={() => toggleSelection(combo)} className="cursor-pointer">
                        <div className="aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden mb-3 md:mb-6 bg-gray-200">
                          <img src={combo.imageUrl} alt={combo.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-sm md:text-base text-brand-dark">{combo.name}</h4>
                          <span className="font-black text-sm md:text-base text-brand-primary">{formatPrice(combo.price)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 md:mb-6">{combo.description}</p>
                    </div>
                    
                    <div className="bg-brand-muted/50 p-2 md:p-3 rounded-xl md:rounded-2xl flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Size:</span>
                        <div className="flex gap-2">
                            {SIZES.map(size => (
                                <button
                                  key={size}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelect(combo.id, size as ProductSize);
                                  }}
                                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                                      selectedItems[combo.id]?.size === size
                                      ? 'bg-brand-primary text-white shadow-sm ring-1 ring-brand-primary'
                                      : 'bg-white text-gray-400 hover:bg-gray-100'
                                  }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {combo.id === 'pack-6' && (
                      <div className="absolute top-3 right-3 bg-brand-dark text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                        Best Value
                      </div>
                    )}
                    
                    {selectedItems[combo.id] && (
                        <div className="absolute top-4 left-4 bg-brand-primary text-white p-1 rounded-full shadow-lg">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-0 sm:ml-2 border-t border-gray-100 pt-12">Build Your Own (সিঙ্গেল পিস)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
                {products.filter(c => !c.isPack).map((combo) => (
                  <div
                    key={combo.id}
                    className={`group relative w-full min-w-0 max-w-full overflow-hidden text-left p-4 md:p-5 rounded-2xl md:rounded-3xl transition-all duration-300 shadow-sm border border-gray-100 ${
                      selectedItems[combo.id] ? 'bg-white shadow-[inset_0_0_0_2px_#F97316]' : 'bg-white/50'
                    }`}
                  >
                    <div onClick={() => toggleSelection(combo)} className="cursor-pointer">
                        <div className="aspect-square rounded-lg md:rounded-2xl overflow-hidden mb-2 md:mb-4 bg-gray-200">
                          <img src={combo.imageUrl} alt={combo.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-brand-dark mb-1 truncate">{combo.name}</h4>
                        <p className="text-[10px] md:text-xs font-black text-brand-primary mb-3 md:mb-4">{formatPrice(combo.price)}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1">
                        {SIZES.map(size => (
                            <button
                              key={size}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelect(combo.id, size as ProductSize);
                              }}
                              className={`h-6 rounded-md text-[8px] font-bold transition-all ${
                                  selectedItems[combo.id]?.size === size
                                  ? 'bg-brand-primary text-white ring-1 ring-brand-primary'
                                  : 'bg-brand-muted text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {selectedItems[combo.id] && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
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
                      <h2 className="text-2xl font-black text-brand-dark mb-8">চেকআউট</h2>
                      
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
                              আপনার অর্ডার সামারি
                            </h3>

                            <div className="space-y-3 mb-6 max-h-[40vh] sm:max-h-[350px] overflow-y-auto pr-1">
                              {activeProducts.map(item => (
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
                                          <p className="text-[11px] font-black shrink-0">{formatPrice(item.price * selectedItems[item.id].quantity)}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                          <p className="text-[9px] text-gray-400 font-bold">
                                              Size: <span className="text-brand-primary">{selectedItems[item.id].size}</span>
                                          </p>
                                          
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-black/40 rounded-lg px-2 py-1 shrink-0">
                                                <button onClick={() => handleQuantity(item.id, -1)} className="text-white/60 hover:text-brand-primary px-1 font-bold text-[10px] transition">-</button>
                                                <span className="font-bold text-white w-3 text-center text-[10px]">{selectedItems[item.id].quantity}</span>
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
                                  </div>
                              ))}
                              {activeProducts.length === 0 && (
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
                                    disabled={activeProducts.length === 0 || isSubmitting}
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
