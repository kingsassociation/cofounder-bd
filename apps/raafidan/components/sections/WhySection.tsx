import { CheckCircle2 } from 'lucide-react';

export function WhySection() {
    const reasons = [
        "সুন্নাহ অনুপ্রাণিত সুগন্ধি",
        "খাঁটি ও অ্যালকোহল মুক্ত",
        "দীর্ঘস্থায়ী সুবাস",
        "বিশ্বাসযোগ্য ও যত্নসহকারে প্রস্তুত"
    ];

    return (
        <section id="why-raafidan" className="py-24 bg-brand-offwhite">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-brand-lightgray/50 shadow-sm relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="relative z-10 text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bangla font-medium text-brand-black">
                                কেন রাফিদান?
                            </h2>
                            <p className="text-brand-darkgray/60 max-w-lg mx-auto font-light leading-relaxed font-bangla">
                                আমরা শুধু আতর বিক্রি করি না, আমরা একটি পবিত্র অনুভূতি পৌঁছে দিই।
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            {reasons.map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-offwhite/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center shrink-0 text-brand-gold">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="text-brand-darkgray font-medium font-bangla text-lg">
                                        {reason}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                             <div className="inline-block px-6 py-3 bg-brand-beige rounded-2xl border border-brand-gold/20">
                                <p className="text-brand-darkgray text-sm font-medium italic font-brand">
                                    "The best perfume is that whose scent is strong and whose color is hidden."
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
