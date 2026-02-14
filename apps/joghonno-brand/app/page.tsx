"use client";

import Navbar from '@/components/Navbar';
import {
  FAQS,
  getWhatsAppUrl,
  PRICING_PLANS,
  TRANSLATIONS,
  WHATSAPP_URL
} from '@/lib/constants';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Video,
  Zap
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 ${lang === 'bn' ? 'bangla-font' : ''}`}>
      <Navbar lang={lang} setLang={setLang} />
      
      {/* Hero Section */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[140px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="reveal inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-12">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </span>
            <span className="text-slate-600 text-sm font-black uppercase tracking-[0.3em]">{t.hero.badge}</span>
          </div>
          
          <h1 className="reveal text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05] mb-12 max-w-6xl mx-auto">
            {t.hero.title} 
            <span className="text-indigo-600 block md:inline"> {t.hero.titleAccent}</span>
          </h1>
          
          <p className="reveal text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-14 font-medium leading-relaxed px-4">
            {t.hero.desc}
          </p>
          
          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-6 px-4 mb-24">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/20">
              <MessageCircle size={28} /> {t.hero.cta}
            </a>
            {/* <button className="w-full sm:w-auto bg-white text-[#0F172A] border border-slate-200 px-12 py-6 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-sm">
              {t.hero.portfolio}
            </button> */}
          </div>

          <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 pt-16 border-t border-slate-100">
            {t.hero.stats.map((stat, i) => (
              <div key={i} className="space-y-3 group text-center">
                <p className="text-xs font-black uppercase text-slate-400 tracking-[0.25em]">{stat.label}</p>
                <p className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tighter">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-28 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-400 text-xs font-black uppercase tracking-widest">Pain Points</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {t.problem.title}
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl font-bold italic">
                {t.problem.closing}
              </p>
            </div>
            <div className="space-y-6">
              {t.problem.items.map((item, idx) => (
                <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-8 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 font-black text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-lg md:text-xl font-bold tracking-tight text-slate-200 group-hover:text-white transition-colors">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600/5 blur-[140px] pointer-events-none"></div>
      </section>

      {/* Target Audience */}
      <section id="process" className="py-28 px-6 bg-slate-50/40">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-10 md:p-20 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight leading-none">{t.audience.title}</h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">{t.audience.desc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:max-w-xl">
              {t.audience.items.map(item => (
                <div key={item} className="px-6 py-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[#0F172A] text-base text-center hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-2 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center lg:text-left mb-20 space-y-6 reveal">
            <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs">{t.services.badge}</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A] leading-tight">{t.services.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 premium-card p-12 md:p-16 flex flex-col justify-between group">
              <div className="space-y-8">
                <div className="w-20 h-20 bg-slate-100 text-[#0F172A] rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <Globe size={40} />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">{t.services.web.title}</h3>
                  <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">{t.services.web.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-12">
                {t.services.web.tags.map(tag => (
                  <span key={tag} className="px-6 py-3 bg-slate-50 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-100">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-4 premium-card p-12 md:p-12 flex flex-col justify-between bg-[#0F172A] text-white border-none overflow-hidden relative group">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-10 relative z-10">
                <Video size={40} />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black tracking-tight text-white">{t.services.social.title}</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.services.social.desc}</p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 mt-8">
                  <Check size={24} className="text-indigo-500" strokeWidth={4} />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{t.services.social.badge}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 premium-card p-12 md:p-14 group">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-10 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Smartphone size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 tracking-tight text-[#0F172A]">{t.services.opt.title}</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">{t.services.opt.desc}</p>
            </div>

            <div className="md:col-span-7 premium-card p-12 md:p-14 bg-indigo-50/30 border-indigo-100/50 group">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-10 shadow-md">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-6 tracking-tight text-[#0F172A]">{t.services.support.title}</h3>
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">{t.services.support.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6 reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-none">{t.pricing.title}</h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">{t.pricing.desc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 items-stretch max-w-7xl mx-auto">
            {PRICING_PLANS[lang].map((plan, idx) => (
              <div 
                key={idx} 
                className={`reveal p-10 lg:p-14 rounded-[3.5rem] border transition-all duration-500 flex flex-col h-full relative group ${
                  plan.isPopular 
                  ? 'bg-[#0F172A] border-[#0F172A] md:scale-105 shadow-2xl text-white z-10' 
                  : 'bg-white border-slate-100 text-[#0F172A] shadow-xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30">
                    {t.pricing.recommended}
                  </div>
                )}
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-10 ${plan.isPopular ? 'text-indigo-400' : 'text-slate-400'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-4xl lg:text-5xl font-black tracking-tighter">{plan.price.split(' ')[0]}</span>
                  <span className={`font-bold text-xs uppercase tracking-widest ${plan.isPopular ? 'text-slate-500' : 'text-slate-400'}`}>{t.pricing.month}</span>
                </div>
                <div className="space-y-8 mb-14 flex-grow">
                  {plan.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <h4 className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block ${plan.isPopular ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-50 text-slate-400'}`}>
                        {section.title}
                      </h4>
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.isPopular ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                            <span className={`font-bold text-xs lg:text-sm leading-snug ${plan.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <a href={getWhatsAppUrl(plan.name, plan.price, lang)} target="_blank" rel="noopener noreferrer" className={`w-full py-6 rounded-2xl font-black text-center text-base uppercase tracking-[0.2em] block transition-all shadow-xl ${plan.isPopular ? 'bg-indigo-600 text-white hover:bg-white hover:text-[#0F172A]' : 'bg-slate-100 text-[#0F172A] hover:bg-indigo-600 hover:text-white'}`}>{t.pricing.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 space-y-6 reveal">
            <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs">Your questions answered</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-none">FAQ</h2>
          </div>
          
          <div className="space-y-6">
            {FAQS[lang].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`reveal group cursor-pointer bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                    isOpen ? 'border-indigo-600 ring-8 ring-indigo-50 shadow-2xl' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'
                  }`} 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div className="p-10 md:p-12 flex items-center justify-between gap-8">
                    <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight ${isOpen ? 'text-indigo-600' : 'text-[#0F172A]'}`}>
                      {faq.question}
                    </h3>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isOpen ? 'bg-indigo-600 border-indigo-600 text-white rotate-180' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                      {isOpen ? <Minus size={28} strokeWidth={3} /> : <Plus size={28} strokeWidth={3} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-12 pb-12 animate-revealFade">
                      <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed border-t border-slate-50 pt-10">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050816] pt-32 pb-16 px-6 border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center mb-32">
            <div className="space-y-12 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start gap-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-indigo-600 rounded-[1.75rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-600/30">J</div>
                  <span className="text-2xl font-black tracking-tighter text-white uppercase">JOGHONNO<span className="text-indigo-600">.</span></span>
                </div>
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-xl">{t.footer.ctaTitle}</h4>
                <div className="flex justify-center md:justify-start gap-6">
                  {[Facebook, Instagram, Linkedin, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-indigo-600 text-slate-500 hover:text-white transition-all duration-300 border border-white/10 hover:-translate-y-3 shadow-lg"><Icon size={32} /></a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-full md:max-w-[580px] bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-12 md:p-16 rounded-[4rem] text-white text-left relative overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5">
                <div className="relative z-10 space-y-12">
                  <div className="space-y-6">
                    <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Let's build something <span className="text-indigo-500">legendary</span>.</h4>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">{t.footer.ctaDesc}</p>
                  </div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group w-full flex items-center justify-center gap-6 bg-indigo-600 hover:bg-[#A3E635] hover:text-[#020617] px-12 py-8 rounded-[2.5rem] text-white font-black tracking-tight text-2xl transition-all duration-500 shadow-xl shadow-indigo-600/20">{t.footer.ctaBtn} <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform" /></a>
                </div>
                <div className="absolute -bottom-20 -right-20 opacity-[0.05] pointer-events-none rotate-12 text-indigo-500"><Zap size={380} /></div>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 flex flex-col justify-center items-center gap-12">
            <div className="text-center space-y-4">
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em]">© 2026 JOGHONNO BRAND.</p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
                <p className="text-white text-lg font-bold tracking-tight">{t.footer.contact}</p>
                <div className="hidden md:block w-3 h-3 bg-indigo-600 rounded-full"></div>
                <p className="text-slate-400 text-base font-medium">Chattogram, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
