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
  const [builderTarget, setBuilderTarget] = useState<number | null>(null);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) {
      trackEvent("ViewContent", {
        content_ids: initialProducts.map(p => p.id),
        content_type: 'product',
        content_category: "Women's Fashion",
        vendor: 'stylehunt'
      });
    }
  }, [initialProducts]);

  const valuePacks = products.filter(c => c.isPack);
  const singleProducts = products.filter(c => !c.isPack);
  
  const hejelProducts = singleProducts.filter(p => p.category === 'Hejel');
  const starjhorjetProducts = singleProducts.filter(p => p.category === 'Starjhorjet');

  const [activeHejel, setActiveHejel] = useState<any>(null);
  const [activeStarjhorjet, setActiveStarjhorjet] = useState<any>(null);

  useEffect(() => {
    if (hejelProducts.length > 0 && !activeHejel) {
        setActiveHejel(hejelProducts[0]);
    }
    if (starjhorjetProducts.length > 0 && !activeStarjhorjet) {
        setActiveStarjhorjet(starjhorjetProducts[0]);
    }
  }, [hejelProducts, starjhorjetProducts, activeHejel, activeStarjhorjet]);

  const selectedIds = Object.keys(selectedItems);
  const activeProducts = products.filter(p => selectedIds.includes(p.id)).filter(p => !p.isPack);
  const totalQuantity = activeProducts.reduce((acc, curr) => acc + selectedItems[curr.id].quantity, 0);

  const calculateSubtotal = () => {
    const baseTotal = activeProducts.reduce((acc, item) => acc + (item.price * selectedItems[item.id].quantity), 0);
    let discount = 0;
    if (totalQuantity >= 6) {
        discount = baseTotal * 0.05;
    } else if (totalQuantity >= 3) {
        discount = baseTotal * 0.03;
    }
    return baseTotal - discount;
  };

  const subtotal = calculateSubtotal();
  const isFreeDelivery = totalQuantity >= 3;
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
            content_category: "Women's Fashion",
            content_type: 'product',
            value: product.price,
            currency: "BDT"
          });
          handleSelect(product.id, SIZES[0]);
      }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!deliveryArea) {
      toast.error('Please select a delivery area');
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
      content_category: "Women's Fashion"
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
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }
      
      toast.success('অর্ডার পাঠানো হয়েছে!');
      
      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        content_ids: activeProducts.map(item => item.id),
        content_category: "Women's Fashion",
        vendor: 'stylehunt'
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

  // Magnifier and details card component
  const ProductSelectionCard = ({ 
    activeProduct, 
    setActiveProduct, 
    allProducts, 
    title 
  }: { 
    activeProduct: any, 
    setActiveProduct: (p: any) => void, 
    allProducts: any[],
    title: string
  }) => {
    const cardContainerRef = React.useRef<HTMLDivElement>(null);
    const cardLensRef = React.useRef<HTMLDivElement>(null);

    const ZOOM = 2.0;
    const LENS_SIZE = 160;

    const handleMouseMove = (e: React.MouseEvent) => {
      const container = cardContainerRef.current;
      const lens = cardLensRef.current;
      if (!container || !lens) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const half = LENS_SIZE / 2;

      const lx = Math.max(0, Math.min(x - half, rect.width - LENS_SIZE));
      const ly = Math.max(0, Math.min(y - half, rect.height - LENS_SIZE));

      lens.style.opacity = '1';
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

      const bgX = (LENS_SIZE / 2) - (x * ZOOM);
      const bgY = (LENS_SIZE / 2) - (y * ZOOM);

      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
      lens.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
    };

    const handleMouseLeave = () => {
      if (!cardLensRef.current) return;
      cardLensRef.current.style.opacity = '0';
    };

    if (!activeProduct) return null;

    return (
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-gray-100 mb-8">
          <h4 className="text-xl font-black text-brand-dark mb-6">{title}</h4>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="flex flex-col gap-6">
                 <div 
                    ref={cardContainerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative aspect-square rounded-3xl overflow-hidden bg-white group flex items-center justify-center border border-gray-100 cursor-none"
                 >
                    <img 
                      key={activeProduct.imageUrl}
                      src={activeProduct.imageUrl} 
                      alt={activeProduct.name} 
                      draggable={false}
                      className="w-full h-full object-contain animate-in fade-in zoom-in duration-300 pointer-events-none select-none"
                    />
                    
                    <div
                      ref={cardLensRef}
                      className="absolute top-0 left-0 rounded-full opacity-0 pointer-events-none transition-opacity duration-200 z-20"
                      style={{
                        width: LENS_SIZE,
                        height: LENS_SIZE,
                        backgroundImage: `url("${activeProduct.imageUrl}")`,
                        backgroundRepeat: 'no-repeat',
                        border: '2px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        willChange: 'transform',
                      }}
                    />

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-dark shadow-sm z-10">
                       {activeProduct.name.replace(` ${activeProduct.category}`, '')}
                    </div>
                 </div>
             </div>

             <div className="flex flex-col">
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">{activeProduct.name}</h3>
                     <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-brand-primary">{formatPrice(activeProduct.price)}</span>
                        { activeProduct.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">{formatPrice(activeProduct.originalPrice)}</span>
                        )}
                        <div className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Save {formatPrice((activeProduct.originalPrice || 1200) - activeProduct.price)}
                        </div>
                     </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 whitespace-pre-line">
                        {activeProduct.description}
                    </p>
                </div>
                <div className="mb-8">
                    <p className="text-xs font-bold text-brand-dark uppercase tracking-widest mb-3">
                        Choose Color
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                        {allProducts.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setActiveProduct(p)}
                              className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                                activeProduct.id === p.id 
                                ? 'border-brand-primary scale-110 shadow-lg' 
                                : 'border-transparent hover:border-gray-200 hover:scale-105'
                              }`}
                            >
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full rounded-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-auto space-y-4">
                    <button 
                      onClick={() => toggleSelection(activeProduct)}
                      className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                          selectedItems[activeProduct.id]
                          ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                          : 'bg-brand-primary text-white hover:bg-brand-dark shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                        {selectedItems[activeProduct.id] ? <Check className="w-5 h-5"/> : <ShoppingCart className="w-5 h-5"/>}
                        {selectedItems[activeProduct.id] ? 'Added to Wardrobe' : 'Add to Wardrobe'}
                    </button>
                </div>
             </div>
          </div>
      </div>
    );
  };

  if (loading || (!activeHejel && !activeStarjhorjet)) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-bold">Loading Store...</p>
      </div>
    );
  }

  return (
    <section id="checkout" className="py-24 bg-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-brand-dark mb-4">Select Your Collection</h2>
          <p className="text-gray-500 text-sm">Pick your favorites and save with combo offers.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            {/* Value Packs Banner */}
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h4 className="font-black text-brand-dark text-lg">Combo Savings Active!</h4>
                  <p className="text-xs text-gray-500 font-medium">Add 3 items for 3% discount or 6 items for 5% discount + Free Delivery.</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${totalQuantity >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>3+ Pack (3%)</div>
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${totalQuantity >= 6 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>6+ Pack (5% + Free)</div>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Build Your Collection
              </h3>
              
              <ProductSelectionCard 
                title="Star Jhorjet Collection"
                activeProduct={activeStarjhorjet}
                setActiveProduct={setActiveStarjhorjet}
                allProducts={starjhorjetProducts}
              />
              
              <ProductSelectionCard 
                title="Premium Hejel Collection"
                activeProduct={activeHejel}
                setActiveProduct={setActiveHejel}
                allProducts={hejelProducts}
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-24" ref={formRef}>
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-4 sm:p-5 md:p-8 shadow-xl border border-gray-100 overflow-hidden relative">
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
                      <h2 className="text-3xl font-black text-brand-dark mb-2">Thank You!</h2>
                      <p className="text-gray-500 text-sm mb-8">Your order has been received successfully.<br/>Our representative will call you soon.</p>
                      <button onClick={() => setIsOrderSuccess(false)} className="bg-brand-muted text-gray-600 px-8 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition">Order More?</button>
                  </motion.div>
              ) : (
                  <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                  >
                      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                        <input type="tel" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" />
                        <textarea rows={2} placeholder="Full Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" />

                         <div className="grid grid-cols-2 gap-3 mt-6">
                           <button type="button" onClick={() => setDeliveryArea('inside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'inside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>Inside Chattogram ({formatPrice(80)})</button>
                           <button type="button" onClick={() => setDeliveryArea('outside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'outside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>Outside ({formatPrice(120)})</button>
                         </div>

                        <div className="bg-brand-dark rounded-[2.5rem] p-3 sm:p-5 md:p-8 mt-10 text-white shadow-2xl relative overflow-hidden group/card border border-white/5">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover/card:bg-brand-primary/20 transition-colors duration-700"></div>
                          <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-6 flex items-center gap-2">
                              <Package className="w-3 h-3" />
                              Order Summary
                            </h3>

                            <div className="space-y-3 mb-6 max-h-[40vh] sm:max-h-[350px] overflow-y-auto pr-1 custom-scrollbar-white">
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
                                          <p className="text-xs font-black leading-tight truncate">{item.name}</p>
                                           <p className="text-xs font-black shrink-0">{formatPrice(item.price * selectedItems[item.id].quantity)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <p className="text-[11px] text-gray-400 font-bold">Size: <span className="text-brand-primary">{selectedItems[item.id].size}</span></p>
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-black/40 rounded-lg px-2 py-1 shrink-0">
                                                <button onClick={() => handleQuantity(item.id, -1)} className="text-white/60 hover:text-brand-primary px-1 font-bold text-[10px] transition">-</button>
                                                <span className="font-bold text-white w-3 text-center text-[10px]">{selectedItems[item.id].quantity}</span>
                                                <button onClick={() => handleQuantity(item.id, 1)} className="text-white/60 hover:text-brand-primary px-1 font-bold text-[10px] transition">+</button>
                                            </div>
                                            <button onClick={() => handleRemove(item.id)} className="text-white/20 hover:text-red-400 transition p-1"><X className="w-3 h-3" /></button>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                              ))}
                              {activeProducts.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                                  <ShoppingCart className="w-8 h-8 mb-2" />
                                  <p className="text-[10px]">Select products...</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1 py-4 border-t border-white/5">
                                {(() => {
                                  const baseTotal = activeProducts.reduce((acc, item) => acc + (item.price * selectedItems[item.id].quantity), 0);
                                  const discountRate = totalQuantity >= 6 ? 0.05 : (totalQuantity >= 3 ? 0.03 : 0);
                                  const savings = baseTotal * discountRate;
                                  
                                  return (
                                    <>
                                       <div className="flex justify-between text-xs text-gray-400">
                                           <span>Subtotal</span>
                                           <span>{formatPrice(baseTotal)}</span>
                                       </div>
                                       {savings > 0 && (
                                         <div className="flex justify-between text-xs text-brand-primary font-bold">
                                             <span>Combo Discount ({discountRate * 100}%)</span>
                                             <span>-{formatPrice(savings)}</span>
                                         </div>
                                       )}
                                    </>
                                  );
                                })()}
                                 <div className="flex justify-between text-xs text-gray-400">
                                     <span>Delivery Charge</span>
                                     <span className={isFreeDelivery ? 'text-brand-primary font-bold' : 'font-bold text-white'}>{isFreeDelivery ? 'FREE' : formatPrice(deliveryCharge)}</span>
                                 </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 pt-8 border-t border-white/10 mt-2">
                                <div className="text-center sm:text-left">
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-1">Total Bill</span>
                                  <span className="text-2xl md:text-3xl font-black text-white leading-none tracking-tighter">{formatPrice(total)}</span>
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
