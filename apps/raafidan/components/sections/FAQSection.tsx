import { Plus } from "lucide-react";

export function FAQSection() {
    const faqs = [
        { q: "Delivery time?", a: "Inside Dhaka: 24-48 Hours. Outside Dhaka: 3-5 Days." },
        { q: "Cash on Delivery available?", a: "Yes, we offer Cash on Delivery nationwide." },
        { q: "Are they 100% Alcohol Free?", a: "Absolutely. All our products are Halal and Alcohol-free." },
        { q: "What is the Exchange Policy?", a: "7-day easy return if the bottle is unopened/damaged." }
    ];

    return (
        <section className="py-24 bg-brand-offwhite border-t border-brand-lightgray/50">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-brand text-brand-black">Common Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-brand-lightgray/50 hover:border-brand-gold/30 transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-brand-darkgray font-brand">{item.q}</h3>
                                <Plus size={16} className="text-brand-gold group-hover:rotate-90 transition-transform" />
                            </div>
                            <p className="text-sm text-brand-darkgray/60 mt-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 font-brand">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
