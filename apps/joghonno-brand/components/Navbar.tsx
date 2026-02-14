"use client";

import {
  TRANSLATIONS,
  WHATSAPP_URL
} from '@/lib/constants';
import {
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NavbarProps {
  lang: 'bn' | 'en';
  setLang: (l: 'bn' | 'en') => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.services, href: '#services' },
    { name: t.process, href: '#process' },
    { name: t.pricing, href: '#pricing' },
    { name: t.faq, href: '#faq' }
  ];

  const [imgError, setImgError] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] transition-all duration-500 px-4 md:px-8 py-4">
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl' : 'bg-transparent border-transparent'}`}>
          <div className="flex items-center gap-3">
            {!imgError ? (
              <img 
                src="/Logo.png" 
                alt="Joghonno" 
                className="h-12 w-auto object-contain" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/10">J</div>
                <span className="text-xl font-black tracking-tighter text-[#0F172A] hidden sm:block uppercase">JOGHONNO<span className="text-indigo-600">.</span></span>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-bold text-slate-500 uppercase tracking-[0.15em] hover:text-indigo-600 transition-colors py-1">
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-1.5 rounded-xl hidden sm:flex">
              <button onClick={() => setLang('bn')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${lang === 'bn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>BN</button>
              <button onClick={() => setLang('en')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>EN</button>
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 group shadow-lg shadow-indigo-500/10">
              {t.start} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button onClick={() => setMobileMenuOpen(true)} className="p-3 bg-white rounded-xl md:hidden text-[#0F172A] border border-slate-200 shadow-sm"><Menu size={28} /></button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[110] bg-[#0F172A] transition-all duration-500 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-8 p-4 text-white bg-white/10 rounded-full hover:bg-white/20 transition-all"><X size={36} /></button>
        <div className="h-full flex flex-col items-center justify-center gap-12 px-10">
          <div className="space-y-8 text-center">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-4xl font-black text-white hover:text-indigo-400 transition-colors">{link.name}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
