"use client";

import { useCartStore } from "@/lib/cart-store";
import { Navbar as SharedNavbar } from "@cofounder/ui";
import { ShoppingCart, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CustomUserMenu from "./auth/CustomUserMenu";
import Logo from "./Logo";

export default function Navbar() {
  const { data: session, status } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const isLoading = status === "loading";

  const rightContent = (
    <div className="flex items-center gap-4">
      {/* Search or other items could go here */}
      <Link
        href="/cart"
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
      
      {isLoading ? (
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      ) : session?.user ? (
        <CustomUserMenu user={session.user} />
      ) : (
        <Link
          href="/sign-in"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
        >
          <User className="w-5 h-5" />
        </Link>
      )}
    </div>
  );

  const navLinks = [
    { label: "Shop", href: "/#products" },
    { label: "Categories", href: "/categories" },
    { label: "Order Tracking", href: "/track-order" },
  ];

  return (
    <SharedNavbar 
      logoComponent={<Logo variant="full" />}
      navLinks={navLinks}
      rightContent={rightContent}
      sticky={true}
    />
  );
}
