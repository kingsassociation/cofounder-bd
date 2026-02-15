'use client';

import { trackEvent } from '@/lib/facebookPixel';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin, Minus, Phone, Plus, Star, User, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CheckoutProps {
  formRef: React.RefObject<HTMLDivElement | null>;
  initialProducts: any[];
}

export function Checkout({ formRef, initialProducts }: CheckoutProps) {
  const [products] = useState<any[]>(initialProducts.length > 0 ? initialProducts : [
    {
      id: 'raafidan-package-1',
      name: 'Oudh Signature',
      price: 390,
      imageUrl: '/package-1.png',
      description: 'এহসাস আল আরাবিয়া, আমির আল উদ, কুল ওয়াটার ব্লু, হোয়াইট উদ, ডানহিল ডিজায়ার',
      badge: 'সেরা অফার'
    },
    {
      id: 'raafidan-package-2',
      name: 'Modern Fresh',
      price: 390,
      imageUrl: '/package-2.png',
      description: 'ভ্যাম্পায়ার ব্লাড, সুলতান, ফ্যান্টাসি, জোপি, সিলভার স্টোন'
    },
    {
      id: 'raafidan-package-3',
      name: 'Traditional Oriental',
      price: 390,
      imageUrl: '/package-3.png',
      description: 'জান্নাতুল ফেরদাউস, রয়েল বাখুর, প্যারিস হিলটন, সিকে ওয়ান, বাকারাত রোজ'
    }
  ]);

  const [selectedPackages, setSelectedPackages] = useState<Record<string, number>>({});
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside' | null>('inside');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      trackEvent("ViewContent", {
        content_ids: products.map(p => p.id),
        content_type: 'product',
        content_category: 'Fragrance',
        vendor: 'raafidan'
      });
    }
  }, [products]);

  const selectedIds = Object.keys(selectedPackages);
  const totalQuantity = Object.values(selectedPackages).reduce((acc, qty) => acc + qty, 0);
  const activeCount = selectedIds.length;
  
  // Custom Pricing Logic: Raafidan specific combo deals
  let subtotal = 0;
  if (totalQuantity === 1) subtotal = 390;
  else if (totalQuantity === 2) subtotal = 690;
  else if (totalQuantity === 3) subtotal = 890;
  else {
    // For 4 or more, apply the best combo + regular price for extras
    // or just calculate based on package prices.
    // Raafidan's current logic seems to favor specific counts.
    // Let's stick to the pattern: 3 combo (890) + (additional * 390)
    if (totalQuantity > 3) {
      subtotal = 890 + (totalQuantity - 3) * 390;
    } else {
      subtotal = selectedIds.reduce((acc, id) => {
        const p = products.find(prod => prod.id === id);
        return acc + ((p?.price || 390) * selectedPackages[id]);
      }, 0);
    }
  }
  
  const deliveryCharge = 0; // Free delivery as requested
  const total = subtotal + deliveryCharge;

  const togglePackage = (id: string) => {
    setSelectedPackages(prev => {
      const newSelected = { ...prev };
      if (newSelected[id]) {
        delete newSelected[id];
      } else {
        trackEvent("AddToCart", {
          content_ids: [id],
          content_name: products.find(p => p.id === id)?.name,
          content_category: 'Fragrance',
          value: products.find(p => p.id === id)?.price,
          currency: "BDT"
        });
        newSelected[id] = 1;
      }
      return newSelected;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedPackages(prev => {
      const newSelected = { ...prev };
      const currentQty = newSelected[id] || 0;
      const newQty = currentQty + delta;
      
      if (newQty <= 0) {
        delete newSelected[id];
      } else {
        newSelected[id] = newQty;
      }
      return newSelected;
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('নাম, মোবাইল ও ঠিকানা লিখুন');
      return;
    }
    if (activeCount === 0) {
      toast.error('অন্তত ১টি প্যাকেজ সিলেক্ট করুন');
      return;
    }

    trackEvent("InitiateCheckout", {
      value: total,
      currency: "BDT",
      content_ids: products.filter(p => selectedIds.includes(p.id)).map(p => p.id),
      content_category: 'Fragrance'
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
          items: products.filter(p => selectedIds.includes(p.id)).map(p => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: selectedPackages[p.id],
            imageUrl: p.imageUrl
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
        content_ids: products.filter(p => selectedIds.includes(p.id)).map(p => p.id),
        content_category: 'Fragrance',
        vendor: 'raafidan'
      });

      setIsOrderSuccess(true);
      setSelectedPackages({});
      setFormData({ name: '', phone: '', address: '' });
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout" className="py-12 md:py-32 bg-brand-offwhite relative overflow-hidden">
      {/* Decorative Brand Text */}
      <div className="absolute top-0 left-0 w-full text-[15vw] font-brand font-black text-brand-black/[0.02] -z-10 select-none whitespace-nowrap -translate-y-1/2">
        RAAFIDAN PREMIUM RAAFIDAN PREMIUM
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-brand-gold/20 mb-8 animate-pulse">
            <Star size={14} className="fill-brand-gold" />
            Original Fragrance 
          </div>
          <h2 className="text-4xl md:text-7xl font-bangla font-black text-brand-black mb-6 tracking-tight">আপনার প্যাকটি <span className="text-brand-gold">বাছাই করুন</span></h2>
          <p className="text-gray-500 font-bangla text-lg max-w-2xl mx-auto leading-relaxed">
             সুন্নাহ অনুপ্রাণিত খাঁটি ও অ্যালকোহল মুক্ত আতরের সেরা কালেকশন। 
             নিচ থেকে আপনার পছন্দের প্যাকেজটি সিলেক্ট করে অর্ডার করুন।
          </p>
          
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 mt-16 max-w-4xl mx-auto px-4">
            {/* Tier 1: Essential */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex-1 bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all text-center group"
            >
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Single Pack</span>
              <h4 className="text-3xl font-body font-black text-brand-black mt-2">390 Tk</h4>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.1em]">1 Package</p>
            </motion.div>

            {/* Tier 2: Premium Duo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 bg-white border-2 border-brand-gold/20 p-6 rounded-[2rem] shadow-md hover:shadow-xl transition-all text-center relative group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg z-10">
                Save 90 Tk
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Premium Duo</span>
              <h4 className="text-3xl font-body font-black text-brand-black mt-2">690 Tk</h4>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.1em]">2 Packages</p>
            </motion.div>

            {/* Tier 3: Ultimate Bundle (The Star) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex-1 bg-brand-black text-white p-6 rounded-[2rem] shadow-2xl shadow-brand-gold/20 text-center relative border border-brand-gold/30 group cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden rounded-[2rem]" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[9px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-20 animate-pulse">
                Best Value • Save 280 Tk
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-brand-gold uppercase">Ultimate Combo</span>
              <h4 className="text-3xl font-body font-black text-white mt-2 tracking-tight">890 Tk</h4>
              <p className="text-[10px] text-brand-lightgray/60 mt-1 font-bangla uppercase tracking-wider">৩টি প্যাকেজের সেরা কালেকশন</p>
            </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Packages List */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            {products.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -10 }}
                onClick={() => togglePackage(pkg.id)}
                className={cn(
                  "group relative overflow-hidden rounded-[3rem] bg-white border-2 p-8 transition-all duration-700 cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl",
                  selectedPackages[pkg.id] 
                    ? "border-brand-gold shadow-brand-gold/10" 
                    : "border-transparent hover:border-brand-gold/30"
                )}
              >
                {pkg.badge && (
                  <div className="absolute top-8 right-8 z-10 bg-brand-black text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-2xl border border-white/10">
                    {pkg.badge}
                  </div>
                )}

                <div className="aspect-[4/3] relative rounded-[2.5rem] overflow-hidden mb-8 bg-brand-offwhite">
                  <Image 
                    src={pkg.imageUrl} 
                    alt={pkg.name} 
                    fill 
                    className={cn(
                      "object-cover transition-transform duration-1000 ease-out",
                      selectedPackages[pkg.id] ? "scale-105" : "group-hover:scale-110"
                    )}
                  />
                  <AnimatePresence>
                    {selectedPackages[pkg.id] && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-brand-gold/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300"
                      >
                         <div className="w-20 h-20 bg-brand-black rounded-full flex items-center justify-center text-brand-gold shadow-2xl border-4 border-white/10">
                            <Check className="w-10 h-10 stroke-[4]" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bangla font-bold text-brand-black leading-tight">
                        {pkg.name}
                    </h3>
                    <div className="text-right">
                       <p className="text-sm font-body text-gray-400 line-through">{Math.round(pkg.price * 1.3)} Tk</p>
                       <p className="text-xl font-body font-black text-brand-gold">{pkg.price} Tk</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    {pkg.contents && pkg.contents.length > 0 ? (
                      <>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">এই প্যাকেজে থাকবে:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {pkg.contents.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-body">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : pkg.description ? (
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">এই প্যাকেজে থাকবে:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {pkg.description.split(',').map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-bangla">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              {item.trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Delivery Promise Card */}
            <div className="bg-brand-black rounded-[2.5rem] p-8 text-white flex flex-col justify-center gap-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-gold/20 transition-colors" />
                 
                 <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold">
                       <Star className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bangla font-bold">সকল অর্ডারে ফ্রি ডেলিভারি!</h3>
                    <p className="text-brand-lightgray/60 text-sm leading-relaxed font-bangla">
                        আপনি যে প্যাকেজই সিলেক্ট করেন না কেন, আমরা চার্জ নিচ্ছি একদম <span className="text-brand-gold font-bold">০ টাকা</span>। এবং পণ্য হাতে পেয়ে টাকা পরিশোধ করার সুবিধা।
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-gold">
                            Cash on Delivery
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-gold">
                            7 Days Return
                        </div>
                    </div>
                 </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-24" ref={formRef}>
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-gray-200/50 border border-brand-lightgray/30 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {isOrderSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                      <Check className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bangla font-bold text-brand-black mb-2">ধন্যবাদ!</h2>
                    <p className="text-gray-500 font-bangla text-sm mb-8 leading-relaxed">
                        আপনার অর্ডারটি সফলভাবে রিসিভ করা হয়েছে।<br/>
                        অর্ডার কনফার্ম করতে আমাদের প্রতিনিধি আপনাকে শীঘ্রই কল করবেন।
                    </p>
                    
                    <button 
                      onClick={() => setIsOrderSuccess(false)}
                      className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg shadow-black/10"
                    >
                      আরও দেখব
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div>
                        <h2 className="text-2xl font-bangla font-bold text-brand-black">অর্ডার করুন</h2>
                        <p className="text-xs font-bangla text-gray-400 mt-1 uppercase tracking-widest">নিচের তথ্যগুলো পূরণ করুন</p>
                    </div>
                    
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="relative group/field">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-brand-gold transition-colors" />
                        <input 
                          type="text" 
                          placeholder="আপনার নাম" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-brand-offwhite border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white focus:border-brand-gold/30 transition-all font-bangla" 
                        />
                      </div>

                      <div className="relative group/field">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-brand-gold transition-colors" />
                        <input 
                          type="tel" 
                          placeholder="মোবাইল নাম্বার" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-brand-offwhite border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white focus:border-brand-gold/30 transition-all font-bangla" 
                        />
                      </div>

                      <div className="relative group/field">
                        <MapPin className="absolute left-5 top-5 w-4 h-4 text-gray-400 group-focus-within/field:text-brand-gold transition-colors" />
                        <textarea 
                          rows={3} 
                          placeholder="পূর্ণ ঠিকানা (বাসা নং, রোড, এলাকা)" 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-brand-offwhite border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:bg-white focus:border-brand-gold/30 transition-all font-bangla" 
                        />
                      </div>

                      {/* Order Summary Card */}
                      <div className="bg-brand-black rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group/summary">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover/summary:bg-brand-gold/20 transition-colors" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Order Summary</h3>
                                <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                                     <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">{totalQuantity} Items</span>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {totalQuantity > 0 ? (
                                    products.filter(p => selectedIds.includes(p.id)).map(p => (
                                        <div key={p.id} className="flex items-center justify-between group/item py-2 border-b border-white/[0.03] last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                                    <Image src={p.imageUrl} alt={p.name} fill className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bangla font-medium text-brand-lightgray truncate max-w-[100px]">{p.name}</span>
                                                    <span className="text-[9px] text-brand-gold font-body">{p.price} Tk</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                                                    <button 
                                                        onClick={() => updateQuantity(p.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center text-brand-lightgray hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-6 text-center text-[10px] font-bold font-body">{selectedPackages[p.id]}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(p.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-brand-lightgray hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => togglePackage(p.id)}
                                                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 opacity-30 italic text-[10px] font-bangla">
                                        কোন প্যাকেজ সিলেক্ট করা হয়নি
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 border-t border-white/5 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-bold font-body">{subtotal} Tk</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Delivery</span>
                                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Total payable</span>
                                        <div className="text-3xl font-brand font-bold text-white tracking-tight">{total} Tk</div>
                                    </div>
                                    
                                    <button 
                                      type="button"
                                      onClick={handleSubmit}
                                      disabled={activeCount === 0 || isSubmitting}
                                      className="bg-brand-gold text-brand-black h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                    >
                                      {isSubmitting ? 'প্রসেসিং...' : 'অর্ডার কনফার্ম'}
                                    </button>
                                </div>
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
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C9A24D;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
