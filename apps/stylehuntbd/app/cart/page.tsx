"use client";
import CoFounderBranding from "@/components/CoFounderBranding";
import { useCartStore } from "@/lib/cart-store";
import { Minus, Plus, ShoppingBag, Trash2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
function UserDetails() {
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";
  const isSignedIn = !!session?.user;
  if (!isLoaded)
    return (
      <div className="animate-pulse h-32 bg-neutral-100 rounded-2xl"></div>
    );
  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Guest Checkout</h2>
        </div>
        <p className="text-neutral-500 text-sm mb-6">
          No account? No problem. You can checkout as a guest. Want to track
          orders?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Account Details</h2>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">
            Authenticated As
          </p>
          <p className="font-bold text-neutral-900">{session.user?.name}</p>
          <p className="text-sm text-neutral-500">{session.user?.email}</p>
        </div>
      </div>
    </div>
  );
}
export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const handleRemove = (
    id: string,
    selectedSize?: string,
    selectedColor?: string,
  ) => {
    removeItem(id, selectedSize, selectedColor);
    toast.success("Item removed from cart");
  };
  const handleUpdateQuantity = (
    id: string,
    newQuantity: number,
    selectedSize?: string,
    selectedColor?: string,
  ) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity, selectedSize, selectedColor);
  };
  const subtotal = getTotal();
  const shippingCharge = 60;
  const total = subtotal + shippingCharge;
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
            <ShoppingBag className="w-24 h-24 mx-auto text-neutral-200 mb-6" />
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Explore our collection and add some premium pieces to your
              wardrobe!
            </p>
            <Link
              href="/"
              className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl shadow-lg shadow-neutral-900/10 hover:bg-neutral-800 transition-all inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="mt-2 text-neutral-600">
              You have {items.length} {items.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Continue Shopping
          </Link>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <button
                        onClick={() =>
                          handleRemove(
                            item.id,
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.selectedSize && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl p-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="p-2.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="p-2.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-400 font-medium">
                          ৳{item.price.toFixed(0)} / each
                        </p>
                        <p className="text-2xl font-black text-neutral-900">
                          ৳{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4 space-y-6">
            <UserDetails />
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 sticky top-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8 tracking-tight">
                Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-neutral-900">
                    ৳{subtotal.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Shipping Charge</span>
                  <span className="font-bold text-neutral-900">
                    ৳{shippingCharge.toFixed(0)}
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-neutral-900">
                      Total
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      ৳{total.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 text-right">
                    Includes all processing fees
                  </p>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-neutral-900/10 transition-all transform hover:-translate-y-1 active:translate-y-0 text-center block"
              >
                Go to Checkout
              </Link>
              <div className="mt-8 border-t border-dotted border-neutral-100">
                <CoFounderBranding />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
