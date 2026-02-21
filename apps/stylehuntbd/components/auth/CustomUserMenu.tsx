"use client";
import {
    ChevronDown,
    LogOut,
    ShoppingBag,
    User as UserIcon
} from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
interface CustomUserMenuProps {
  user: User & { id?: string };
}
export default function CustomUserMenu({ user }: CustomUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!user) return null;
  return (
    <div className="relative" ref={menuRef}>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
      >
        <span className="hidden md:block text-sm font-medium text-neutral-700 max-w-[100px] truncate">
          {user.name || user.email}
        </span>
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200">
          {}
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          {}
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-bold text-neutral-900 truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
          {}
          <div className="p-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors group"
            >
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                <UserIcon size={16} />
              </div>
              <div>
                <span className="block font-medium">My Profile</span>
                <span className="block text-[10px] text-neutral-400">
                  Manage account & phone
                </span>
              </div>
            </Link>
            <Link
              href="/profile?tab=orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors group"
            >
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md group-hover:bg-purple-100 transition-colors">
                <ShoppingBag size={16} />
              </div>
              <span className="font-medium">My Orders</span>
            </Link>
            {}
            <div className="my-1 border-t border-neutral-100"></div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <div className="p-1.5 bg-red-50 text-red-600 rounded-md group-hover:bg-red-100 transition-colors">
                <LogOut size={16} />
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
