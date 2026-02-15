'use client';

import { cn } from '@/lib/utils';
import { useBrand } from '@/providers/BrandProvider';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    ChevronDown,
    LayoutDashboard,
    Package,
    RefreshCw,
    Search,
    Settings,
    ShoppingBag,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export function PlatformShell({ children }: { children: React.ReactNode }) {
    const { activeBrand, setActiveBrand, brands } = useBrand();
    const pathname = usePathname();
    const [isBrandSwitcherOpen, setIsBrandSwitcherOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    if (pathname === '/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside 
                className={cn(
                    "bg-white border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 relative z-50",
                    isCollapsed ? "w-14" : "w-64"
                )}
            >
                <div className={cn("p-6 flex-1 overflow-y-auto no-scrollbar", isCollapsed && "p-2")}>
                    <div className={cn("flex items-center gap-3 mb-12 relative", isCollapsed && "justify-center")}>
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 rotate-3 group hover:rotate-0 transition-transform duration-300 shrink-0">
                            <span className="text-white font-black text-lg">C</span>
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="font-black tracking-tight text-slate-900 text-xl block leading-none">Control</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Ecosystem Admin</span>
                            </motion.div>
                        )}
                        
                    </div>

                    <div className="space-y-1.5">
                        {!isCollapsed && (
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block ml-4">Main Menu</span>
                        )}
                        <nav className="space-y-1">
                            <SidebarLink href="/" icon={LayoutDashboard} label="Dashboard" active={pathname === '/'} collapsed={isCollapsed} />
                            <SidebarLink href="/orders" icon={ShoppingBag} label="Orders" active={pathname === '/orders'} collapsed={isCollapsed} />
                            <SidebarLink href="/inventory" icon={Package} label="Inventory" active={pathname === '/inventory'} collapsed={isCollapsed} />
                            <SidebarLink href="/customers" icon={Users} label="Customers" active={pathname === '/customers'} collapsed={isCollapsed} />
                            <SidebarLink href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} collapsed={isCollapsed} />
                        </nav>
                    </div>
                </div>

                <div className={cn("p-4 space-y-4 border-t border-slate-100", isCollapsed && "p-2")}>
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "flex items-center gap-3 w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-200",
                            isCollapsed ? "justify-center" : "px-5"
                        )}
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 180 : 0 }}
                            className="shrink-0"
                        >
                            <ChevronDown size={18} className="-rotate-90" />
                        </motion.div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="relative">
                        <button 
                            onClick={() => setIsBrandSwitcherOpen(!isBrandSwitcherOpen)}
                            className="group flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-slate-100 hover:border-slate-200 shadow-sm"
                        >
                            <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-[11px] text-white font-black uppercase shadow-md group-hover:scale-110 transition-transform">
                                {activeBrand ? activeBrand.name[0] : 'A'}
                            </div>
                            <div className="text-left">
                                <span className="text-sm font-black text-slate-900 block leading-none">{activeBrand ? activeBrand.name : 'All Brands'}</span>
                                <span className="text-[10px] font-bold text-slate-400 block mt-0.5 tracking-wide">Switch Context</span>
                            </div>
                            <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-300", isBrandSwitcherOpen && "rotate-180")} />
                        </button>
                        
                        <AnimatePresence>
                            {isBrandSwitcherOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsBrandSwitcherOpen(false)} 
                                    />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-0 mt-3 w-64 bg-white border border-slate-200/60 rounded-[1.5rem] shadow-2xl p-2 z-50 backdrop-blur-xl"
                                    >
                                        <div className="px-3 py-2 border-b border-slate-50">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Context Management</span>
                                        </div>
                                        <div className="p-1.5 space-y-1">
                                            <button
                                                onClick={() => {
                                                    setActiveBrand(null);
                                                    setIsBrandSwitcherOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200",
                                                    !activeBrand
                                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 font-bold" 
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black uppercase",
                                                    !activeBrand ? "bg-white/20" : "bg-slate-100"
                                                )}>
                                                    A
                                                </div>
                                                Global View (All)
                                            </button>

                                            <div className="h-px bg-slate-50 my-1 mx-2" />

                                            {brands.map(brand => (
                                                <button
                                                    key={brand.id}
                                                    onClick={() => {
                                                        setActiveBrand(brand);
                                                        setIsBrandSwitcherOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200",
                                                        activeBrand?.id === brand.id 
                                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 font-bold" 
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black uppercase",
                                                        activeBrand?.id === brand.id ? "bg-white/20" : "bg-slate-100"
                                                    )}>
                                                        {brand.name[0]}
                                                    </div>
                                                    {brand.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200/60 w-64 group focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
                            <Search size={16} className="text-slate-400 group-focus-within:text-slate-900" />
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                className="bg-transparent border-0 outline-none w-full ml-3 text-xs font-medium placeholder:text-slate-400"
                            />
                        </div>

                        <button 
                            onClick={() => window.location.reload()}
                            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                        >
                            <RefreshCw size={18} />
                        </button>

                        <button className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-slate-200/60">
                            <div className="text-right">
                                 <span className="text-sm font-black text-slate-900 block leading-none">Admin</span>
                                 <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Super Administrator</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-black p-[2px] shadow-lg">
                                <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center overflow-hidden">
                                     <Users size={24} className="text-slate-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Area */}
                <div className="flex-1 overflow-y-auto p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon: Icon, label, active = false, collapsed = false }: { href: string, icon: any, label: string, active?: boolean, collapsed?: boolean }) {
    return (
        <Link href={href} className={cn(
            "flex items-center w-full rounded-[1.25rem] text-sm font-black transition-all duration-300 relative group",
            active 
                ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            collapsed ? "justify-center py-4" : "gap-4 px-5 py-4"
        )}>
            <Icon size={20} className={cn("transition-transform duration-300 shrink-0", active ? "scale-110" : "group-hover:scale-110")} />
            {!collapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                >
                    {label}
                </motion.span>
            )}
            {active && !collapsed && (
                <motion.div 
                    layoutId="active-pill"
                    className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                />
            )}
            {active && collapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-slate-900 rounded-l-full" />
            )}
        </Link>
    );
}
