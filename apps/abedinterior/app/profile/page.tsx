"use client";
import AddressesTab from "@/components/profile/AddressesTab";
import OrdersTab from "@/components/profile/OrdersTab";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import SecurityTab from "@/components/profile/SecurityTab";
import WishlistTab from "@/components/profile/WishlistTab";
import {
  Heart,
  KeyRound,
  Loader2,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const loading = status === "loading";
  useEffect(() => {
    if (!loading && !session) {
      router.push("/sign-in");
    }
  }, [loading, session, router]);
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`, { scroll: false });
  };
  if (loading || !session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      <ProfileSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
        {activeTab === "overview" && (
          <OverviewTab session={session} changeTab={handleTabChange} />
        )}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "wishlist" && <WishlistTab />}
        {activeTab === "personal" && <PersonalInfoTab />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "security" && <SecurityTab />}
      </main>
    </div>
  );
}
function OverviewTab({
  session,
  changeTab,
}: {
  session: any;
  changeTab: (t: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => changeTab("orders")}
          className="bg-blue-50 p-6 rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <ShoppingBag className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-neutral-900">Recent Orders</h3>
          <p className="text-sm text-neutral-500 mt-1">
            View your order history
          </p>
        </div>
        <div
          onClick={() => changeTab("wishlist")}
          className="bg-red-50 p-6 rounded-xl border border-red-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <Heart className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-neutral-900">Wishlist</h3>
          <p className="text-sm text-neutral-500 mt-1">Saved items</p>
        </div>
        <div
          onClick={() => changeTab("addresses")}
          className="bg-purple-50 p-6 rounded-xl border border-purple-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <MapPin className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-neutral-900">Saved Addresses</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Manage shipping locations
          </p>
        </div>
        <div
          onClick={() => changeTab("personal")}
          className="bg-green-50 p-6 rounded-xl border border-green-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <User className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-neutral-900">Personal Info</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Update profile details
          </p>
        </div>
        <div
          onClick={() => changeTab("security")}
          className="bg-orange-50 p-6 rounded-xl border border-orange-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <KeyRound className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-neutral-900">Security</h3>
          <p className="text-sm text-neutral-500 mt-1">Change password</p>
        </div>
      </div>
    </div>
  );
}
