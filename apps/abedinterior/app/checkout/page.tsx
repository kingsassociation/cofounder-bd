"use client";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/facebookPixel";
import { formatPrice } from "@cofounder/utils";
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User as UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
interface BDLocation {
  id: string;
  name: string;
}
export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const hasTrackedInitiate = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phoneNumber: "",
    deliveryLocation: "metro", // 'metro', 'outside', 'coxsbazar'
    address: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const subtotal = getTotal();
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const deliveryCharge = formData.deliveryLocation === "metro" ? 0 : 
                        formData.deliveryLocation === "outside" ? 2000 : 4000;
                        
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    if (items.length > 0 && !hasTrackedInitiate.current && subtotal > 0) {
      trackEvent("InitiateCheckout", {
        value: total,
        currency: "BDT",
        content_ids: items.map(item => {
          const rawId = String(item.originalId || item.id);
          return rawId.includes("--") ? rawId.split("--")[0] : rawId;
        }),
        content_type: "product",
        num_items: items.reduce((acc, item) => acc + item.quantity, 0),
        vendor: "abedinterior"
      });
      hasTrackedInitiate.current = true;
    }
  }, [items.length, subtotal, total]);
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (selectedAddressId) {
      setSelectedAddressId("");
    }
  };
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [saveAddress, setSaveAddress] = useState(false);
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setSavedAddresses(data);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);
  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses.find((a) => a.id === addrId);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        fullName: addr.name,
        phoneNumber: addr.phoneNumber,
        address: addr.address,
        deliveryLocation: addr.deliveryLocation || "metro",
      }));
      toast.success("Address details loaded");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !/^01[3-9]\d{8}$/.test(formData.phoneNumber) &&
      !/^\+8801[3-9]\d{8}$/.test(formData.phoneNumber)
    ) {
      toast.error("Please enter a valid Bangladeshi phone number");
      return;
    }
    if (totalQuantity < 10) {
      toast.error("Minimum order is 10 rolls.");
      return;
    }
    if (formData.address.length < 10) {
      toast.error("Please provide a more detailed address");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress: formData,
          total,
          deliveryCharge,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Track Purchase event successfully here
      trackEvent("Purchase", {
        value: total,
        currency: "BDT",
        content_ids: items.map(item => {
          const rawId = String(item.originalId || item.id);
          return rawId.includes("--") ? rawId.split("--")[0] : rawId;
        }),
        content_type: "product",
        num_items: items.reduce((acc, item) => acc + item.quantity, 0),
        order_id: data.orderId,
        vendor: "abedinterior"
      });

      if (saveAddress && session?.user) {
        try {
          await fetch("/api/user/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              label: "Home",
              name: formData.fullName,
              phoneNumber: formData.phoneNumber,
              address: formData.address,
              deliveryLocation: formData.deliveryLocation,
              isPrimary: false,
            }),
          });
        } catch (err) {
          console.error("Failed to save address silently", err);
        }
      }
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };
  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
            Checkout
          </h1>
          <p className="mt-2 text-neutral-600">
            Complete your order with just a few details.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-50 text-brand-600 rounded-lg">
                    <UserIcon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Abdullah Al Mamun"
                        className="w-full pl-4 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>
              {}
              <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                      <MapPin size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Shipping Address
                    </h2>
                  </div>
                  {savedAddresses.length > 0 && (
                    <div className="w-full sm:w-auto">
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressSelect(e.target.value)}
                        className="w-full sm:w-64 text-sm border border-neutral-300 rounded-xl px-4 py-2.5 bg-white hover:border-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors cursor-pointer shadow-sm"
                      >
                        <option value="">Select Saved Address</option>
                        {savedAddresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.label} - {addr.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Delivery & Installation
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryLocation === 'metro' ? 'bg-brand-600 border-brand-600 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
                        <input
                          type="radio"
                          name="deliveryLocation"
                          value="metro"
                          checked={formData.deliveryLocation === 'metro'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm">CTG Metropolitan</span>
                        <span className="text-xs opacity-80 mt-1">Free Installation</span>
                      </label>
                      <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryLocation === 'outside' ? 'bg-brand-600 border-brand-600 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
                        <input
                          type="radio"
                          name="deliveryLocation"
                          value="outside"
                          checked={formData.deliveryLocation === 'outside'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm">Outside Metro</span>
                        <span className="text-xs opacity-80 mt-1">+2,000 BDT</span>
                      </label>
                      <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryLocation === 'coxsbazar' ? 'bg-brand-600 border-brand-600 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
                        <input
                          type="radio"
                          name="deliveryLocation"
                          value="coxsbazar"
                          checked={formData.deliveryLocation === 'coxsbazar'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm">Cox's Bazar</span>
                        <span className="text-xs opacity-80 mt-1">+4,000 BDT</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="e.g. House #12, Road #4, Sector #7, Chattogram"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none"
                    />
                  </div>
                  {session?.user && (
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-neutral-700">
                          Save this address for future orders
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </section>
              {}
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Payment Selection
                  </h2>
                </div>
                <div className="p-5 border-2 border-brand-600 bg-gray-50 rounded-2xl relative">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-5 h-5 rounded-full border-4 border-brand-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Cash on Delivery (COD)
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Pay when you receive the product at your doorstep.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                          Popular
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                          Safe
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>
          {}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.selectedSize && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                            Color: {item.selectedColor}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto flex justify-between items-end">
                        <p className="text-xs text-neutral-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                        <p className="text-sm font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-neutral-100 pt-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span>Shipping</span>
                    <Truck size={14} className="text-neutral-400" />
                  </div>
                  <span className="font-medium text-neutral-900">
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-4 mt-2">
                  <div className="flex justify-between items-center text-xl font-extrabold text-neutral-900">
                    <span>Total</span>
                    <span className="text-brand-600">{formatPrice(total)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 text-right">
                    Includes all applicable taxes
                  </p>
                </div>
              </div>
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-8 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-neutral-900/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 h-[60px]"
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ShieldCheck size={20} />
                  </>
                )}
              </button>
              <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Truck size={12} className="text-gray-400" />
                  <span>Doorstep Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
