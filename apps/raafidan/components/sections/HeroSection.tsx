interface HeroProps {
    onOrderClick: () => void;
}

export function HeroSection({ onOrderClick }: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black text-brand-offwhite">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <img 
                    src="/hero.png" 
                    alt="Raafidan Premium Fragrance" 
                    className="w-full h-full object-cover opacity-80"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8">
                {/* Brand Identity */}
                <div className="space-y-4">
                    <h2 className="text-brand-gold text-xs md:text-sm font-black tracking-[0.3em] uppercase opacity-90">
                        Islamic Fragrance House
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-brand font-medium tracking-tight text-white leading-[1.1]">
                        RAAFIDAN
                    </h1>
                </div>

                {/* Divider */}
                <div className="w-24 h-[1px] bg-brand-gold/50 mx-auto my-8" />

                {/* Sub-headline (English) */}
                <p className="text-lg md:text-xl font-light text-brand-lightgray/90 tracking-wide max-w-2xl mx-auto">
                    Premium Attar & Fragrance Crafted for Purity & Presence
                </p>

                {/* Sub-headline (Bangla) */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl max-w-xl mx-auto mt-8">
                    <p className="text-base md:text-lg text-brand-offwhite font-medium leading-relaxed font-bangla">
                        খাঁটি আতর ও ইসলামিক সুগন্ধি<br />
                        <span className="text-brand-gold/90 text-sm mt-2 block opacity-90">নামাজ, ইবাদত ও দৈনন্দিন ব্যবহারের জন্য</span>
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
                    <button 
                        onClick={onOrderClick}
                        className="px-8 py-4 bg-brand-gold text-brand-black text-sm font-black uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-full min-w-[200px]"
                    >
                        Order Now (অর্ডার করুন)
                    </button>
                    <button 
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className="px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300 rounded-full min-w-[200px]"
                    >
                        Features
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-brand-gold to-transparent opacity-50" />
            </div>
        </section>
    );
}
