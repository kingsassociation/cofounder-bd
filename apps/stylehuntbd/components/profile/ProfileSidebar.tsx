"use client";
import { clsx } from "clsx";
import {
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Security", icon: KeyRound },
];
export default function ProfileSidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:min-h-[calc(100vh-64px)]">
      <div className="p-4 md:p-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 hidden md:block">
          Account
        </h2>
        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            const href =
              item.id === "overview" ? "/profile" : `/profile?tab=${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={clsx(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-gray-400",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 hidden md:block">
          Session
        </h2>
        <div className="hidden md:block">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
