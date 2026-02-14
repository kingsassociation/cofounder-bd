import { Droplets, Moon, ShieldCheck, Truck } from 'lucide-react';

export function TrustStrip() {
    const features = [
        { icon: ShieldCheck, text: "100% Authentic", sub: "Garanty" },
        { icon: Droplets, text: "Alcohol Free", sub: "Purity" },
        { icon: Moon, text: "Sunnah Inspired", sub: "Tradition" },
        { icon: Truck, text: "Cash on Delivery", sub: "Nationwide" },
    ];

    return (
        <section className="bg-brand-black/95 text-white py-8 border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {features.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <item.icon className="w-5 h-5 text-brand-gold" />
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-widest font-brand">{item.text}</p>
                                <p className="text-[10px] text-gray-400 font-brand">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
