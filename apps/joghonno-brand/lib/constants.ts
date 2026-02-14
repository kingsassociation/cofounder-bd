export interface PricingPlanSection {
    title: string;
    items: string[];
}

export interface PricingPlan {
    name: string;
    price: string;
    sections: PricingPlanSection[];
    isPopular?: boolean;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export const WHATSAPP_NUMBER = "8801805543686";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello, I want to know more about Joghonno Brand packages.`;

export const getWhatsAppUrl = (planName: string, price: string, lang: 'bn' | 'en') => {
    const message = lang === 'bn'
        ? `হ্যালো, আমি আপনাদের "${planName}" প্যাকেজটি (মূল্য: ${price}) সম্পর্কে বিস্তারিত জানতে চাই এবং অর্ডার করতে চাই।`
        : `Hello, I'm interested in the "${planName}" package (Price: ${price}) and would like to proceed with an order.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const TRANSLATIONS = {
    bn: {
        nav: { services: 'সার্ভিস', process: 'প্রসেস', pricing: 'প্রাইসিং', faq: 'FAQ', start: 'শুরু হোক' },
        hero: {
            badge: 'প্রিমিয়াম ডিজিটাল গ্রোথ স্ট্রেটেজি',
            title: 'আপনার ব্যবসাকে ',
            titleAccent: 'প্রিমিয়াম ব্র্যান্ড হিসেবে গড়ে তুলুন',
            desc: 'আমরা সাধারণ কাজ করি না। আমরা আপনার ব্যবসার জন্য এমন ওয়েবসাইট ও কন্টেন্ট তৈরি করি যা কাস্টমারকে ব্র্যান্ডের প্রতি আগ্রহী করে তুলবে। ৭ দিনে শুরু হোক আপনার ডিজিটাল বিপ্লব।',
            cta: 'ফ্রি কনসালটেশন নিন',
            portfolio: 'কাজ দেখুন',
            stats: [
                { label: "প্রতিষ্ঠিত", val: "২০২৪" },
                { label: "অ্যাক্টিভ ক্লায়েন্ট", val: "৫০+" },
                { label: "গড় গ্রোথ", val: "১৪০%" },
                { label: "ইমপ্যাক্ট", val: "অসাধারণ" }
            ]
        },
        problem: {
            title: 'ডিজিটাল দুনিয়ায় পিছিয়ে পড়ছেন?',
            items: [
                'সময় নেই নিয়মিত আকর্ষণীয় কনটেন্ট তৈরির?',
                'ব্র্যান্ডিং বা ওয়েবসাইট প্রফেশনাল মনে হচ্ছে না?',
                'সঠিক অডিয়েন্সের কাছে পৌঁছাতে পারছেন না?'
            ],
            closing: 'এর ফলে সেলস কমে যাচ্ছে, তাই না?'
        },
        audience: {
            title: 'এটি কি আপনার জন্য?',
            desc: 'লোকাল শপ হোক বা অনলাইন ব্র্যান্ড—যদি আপনি আপনার ডিজিটাল প্রেজেন্স নিয়ে সিরিয়াস এবং প্রফেশনাল গ্রোথ চান, তবে আমরা আছি।',
            items: ["লোকাল শপ", "অনলাইন সেলার", "স্টার্টআপ", "পার্সোনাল ব্র্যান্ড", "সার্ভিস প্রোভাইডার", "রিয়েল এস্টেট"]
        },
        services: {
            badge: 'প্রিমিয়াম এক্সপার্ট সার্ভিস',
            title: 'ডিজিটাল বিপ্লবে আমরাই আপনার অস্ত্র',
            desc: 'ডিজাইন থেকে পোস্টিং—সবকিছু আমরা সামলাবো। আপনি শুধু অর্ডার সামলান।',
            web: { title: 'প্রিমিয়াম সেলস ওয়েবসাইট', desc: 'এমন এক ওয়েবসাইট যা কেবল সুন্দর নয়, অবিশ্বাস্য গতিতে ফাস্ট এবং কাস্টমার কনভার্ট করতে ওস্তাদ।', tags: ['High Speed', 'Clean SEO', 'Direct WhatsApp'] },
            social: { title: 'ভাইরাল কন্টেন্ট স্ট্রেটেজি', desc: 'প্রতি মাসে ১০টি কাস্টম কন্টেন্ট যা আপনার রিচ বাড়াবে অবিশ্বাস্য ভাবে।', badge: '৪টি হাই-এন্ড ভিডিও' },
            opt: { title: 'পেজ ডমিনেশন', desc: 'Facebook, Instagram ও TikTok এর কমপ্লিট সেটআপ এবং প্রফেশনাল অথরিটি তৈরি করা।' },
            support: { title: 'এক্সক্লুসিভ সাপোর্ট (২৪/৭)', desc: 'আমরা শুধু কাজ করি না, নিয়মিত আপনার ব্যবসার গ্রোথ মনিটর করি এবং রিপোর্ট প্রদান করি।' }
        },
        pricing: {
            title: 'সেরা ভ্যালু সাশ্রয়ী প্ল্যান',
            desc: 'হিডেন চার্জ নেই। ৩ মাসের মেম্বারশিপে আপনার ব্যবসাকে দিন এক নতুন প্রিমিয়াম রূপ।',
            month: '/মাস',
            cta: 'শুরু করি',
            recommended: 'সেরা ভ্যালু'
        },
        footer: {
            ctaTitle: 'এখনই শুরু করবেন?',
            ctaDesc: 'আপনার ব্যবসার আইডিয়া নিয়ে প্রফেশনালভাবে আমাদের সাথে আলাপ করুন।',
            ctaBtn: 'WhatsApp করুন',
            contact: 'যোগাযোগ: ০১৮০৫৫৪৩৬৮৬'
        }
    },
    en: {
        nav: { services: 'Services', process: 'Process', pricing: 'Pricing', faq: 'FAQ', start: 'Get Started' },
        hero: {
            badge: 'Premium Digital Growth Strategy',
            title: 'Build Your Business ',
            titleAccent: 'as an Elite Brand',
            desc: 'We don’t do average. We create websites and content that are exceptionally effective. Start your digital revolution in 7 days.',
            cta: 'Get Free Consultation',
            portfolio: 'Our Work',
            stats: [
                { label: "Founded", val: "2024" },
                { label: "Active Clients", val: "50+" },
                { label: "Avg. Growth", val: "140%" },
                { label: "Impact", val: "Exceptional" }
            ]
        },
        problem: {
            title: 'Falling Behind in the Digital World?',
            items: [
                'No time to create engaging content regularly?',
                'Your branding or website doesn’t look professional?',
                'Not reaching the right audience?'
            ],
            closing: 'This leads to fewer sales, doesn’t it?'
        },
        audience: {
            title: 'Is this for you?',
            desc: 'Whether a local shop or an online brand—if you are serious about professional growth, we are here.',
            items: ["Local Shop", "Online Seller", "Startup", "Personal Brand", "Service Provider", "Real Estate"]
        },
        services: {
            badge: 'Premium Agency Services',
            title: 'We are your Digital Weapon',
            desc: 'From design to posting—we handle everything. You just handle the orders.',
            web: { title: 'Elite Sales Website', desc: 'A website that isn’t just pretty, it’s blazingly fast and a conversion powerhouse.', tags: ['High Speed', 'Clean SEO', 'Direct WhatsApp'] },
            social: { title: 'Viral Content Strategy', desc: '10 custom contents per month that will boost your reach significantly.', badge: '4 High-end Videos' },
            opt: { title: 'Page Domination', desc: 'Complete setup and authority building on Facebook, Instagram, and TikTok.' },
            support: { title: 'Priority Support (24/7)', desc: 'We don’t just work; we monitor your growth and provide regular performance reports.' }
        },
        pricing: {
            title: 'Highly Affordable Premium Plans',
            desc: 'No hidden charges. Give your business a stunning professional makeover with a 3-month membership.',
            month: '/mo',
            cta: 'Start Now',
            recommended: 'Best Value'
        },
        footer: {
            ctaTitle: 'Ready to start?',
            ctaDesc: 'Talk to us about your business idea in a professional way.',
            ctaBtn: 'WhatsApp Us',
            contact: 'Contact: 01805543686'
        }
    }
};

export const PRICING_PLANS = {
    bn: [
        {
            name: "Starter",
            price: "৳১০,০০০ / মাস",
            sections: [
                {
                    title: "ওয়েবসাইট ও ইনফ্রাস্ট্রাকচার",
                    items: [
                        "কাস্টম প্রফেশনাল বিজনেস ওয়েবসাইট",
                        "মোবাইল রেসপনসিভ ও অপটিমাইজড ডিজাইন",
                        "ডোমেইন ও সিকিউর হোস্টিং সেটআপ",
                        "বেসিক পারফরম্যান্স ও সিকিউরিটি কনফিগারেশন"
                    ]
                },
                {
                    title: "সোশ্যাল মিডিয়া সেটআপ",
                    items: [
                        "ফেসবুক বিজনেস পেজ তৈরি ও অপটিমাইজেশন",
                        "ইনস্টাগ্রাম বিজনেস অ্যাকাউন্ট সেটআপ",
                        "টিকটক বিজনেস প্রোফাইল সেটআপ",
                        "লোগো ও কভার ডিজাইন"
                    ]
                },
                {
                    title: "কন্টেন্ট সার্ভিস",
                    items: [
                        "মাসিক ১০টি কাস্টম কন্টেন্ট",
                        "কন্টেন্ট থিম ও পোস্ট গাইডলাইন",
                        "ব্র্যান্ড অনুযায়ী ভিজুয়াল স্টাইল"
                    ]
                },
                {
                    title: "সাপোর্ট ও মালিকানা",
                    items: [
                        "নিরবচ্ছিন্ন টেকনিক্যাল সাপোর্ট",
                        "মিনিমাম ৬ মাস চুক্তি",
                        "৬ মাস শেষে পূর্ণ মালিকানা"
                    ]
                }
            ]
        },
        {
            name: "Growth",
            price: "৳১৫,০০০ / মাস",
            isPopular: true,
            sections: [
                {
                    title: "ওয়েবসাইট ও অপটিমাইজেশন",
                    items: [
                        "কনভার্সন-ফোকাসড ওয়েবসাইট স্ট্রাকচার",
                        "ইউজার ফ্লো ও কন্টেন্ট অপটিমাইজেশন",
                        "ডোমেইন ও হোস্টিং ম্যানেজমেন্ট"
                    ]
                },
                {
                    title: "সোশ্যাল ও ব্র্যান্ডিং",
                    items: [
                        "সব প্ল্যাটফর্মে বিজনেস সেটআপ",
                        "ব্র্যান্ড কনসিসটেন্সি গাইডলাইন",
                        "প্রোফাইল ভিজুয়াল অপটিমাইজেশন"
                    ]
                },
                {
                    title: "কন্টেন্ট ও মার্কেটিং",
                    items: [
                        "মাসিক ১৫টি প্রিমিয়াম কন্টেন্ট",
                        "কন্টেন্ট ক্যালেন্ডার পরিকল্পনা",
                        "ফেসবুক ও ইনস্টাগ্রাম অ্যাড সেটআপ",
                        "বেসিক অডিয়েন্স টার্গেটিং"
                    ]
                },
                {
                    title: "রিপোর্ট ও সাপোর্ট",
                    items: [
                        "মাসিক পারফরম্যান্স রিপোর্ট",
                        "নিয়মিত টেকনিক্যাল ও মার্কেটিং সাপোর্ট"
                    ]
                }
            ]
        },
        {
            name: "Pro",
            price: "৳২১,০০০ / মাস",
            sections: [
                {
                    title: "এডভান্সড ওয়েব সিস্টেম",
                    items: [
                        "সম্পূর্ণ ব্র্যান্ডেড স্কেল-রেডি ওয়েবসাইট",
                        "এডভান্সড পারফরম্যান্স টিউনিং",
                        "সিকিউরিটি ও রেগুলার মেইনটেন্যান্স"
                    ]
                },
                {
                    title: "ফুল ব্র্যান্ড প্রেজেন্স",
                    items: [
                        "সব সোশ্যাল প্ল্যাটফর্মে প্রফেশনাল সেটআপ",
                        "ব্র্যান্ড পজিশনিং স্ট্র্যাটেজি"
                    ]
                },
                {
                    title: "এডভান্সড কন্টেন্ট ও অ্যাডস",
                    items: [
                        "মাসিক ২০টি হাই-এন্ড কন্টেন্ট",
                        "ফুল অ্যাড ক্যাম্পেইন ম্যানেজমেন্ট",
                        "কাস্টম অডিয়েন্স ও রিটার্গেটিং"
                    ]
                },
                {
                    title: "গ্রোথ ও সাপোর্ট",
                    items: [
                        "মাসিক গ্রোথ অ্যানালাইসিস",
                        "প্রায়োরিটি সাপোর্ট",
                        "ডেডিকেটেড বিজনেস গাইডেন্স"
                    ]
                }
            ]
        }
    ],
    en: [
        {
            name: "Starter",
            price: "৳10,000 / month",
            sections: [
                {
                    title: "Website & Infrastructure",
                    items: [
                        "Custom Professional Business Website",
                        "Mobile Responsive & Optimized Design",
                        "Domain & Secure Hosting Setup",
                        "Basic Performance & Security Config"
                    ]
                },
                {
                    title: "Social Media Setup",
                    items: [
                        "FB Business Page Creation & Optimization",
                        "Instagram Business Account Setup",
                        "TikTok Business Profile Setup",
                        "Logo & Cover Design"
                    ]
                },
                {
                    title: "Content Service",
                    items: [
                        "10 Custom Contents Per Month",
                        "Content Themes & Posting Guidelines",
                        "Brand-consistent Visual Style"
                    ]
                },
                {
                    title: "Support & Ownership",
                    items: [
                        "Seamless Technical Support",
                        "Minimum 6-month Contract",
                        "Full Ownership After 6 Months"
                    ]
                }
            ]
        },
        {
            name: "Growth",
            price: "৳15,000 / month",
            isPopular: true,
            sections: [
                {
                    title: "Website & Optimization",
                    items: [
                        "Conversion-focused Website Structure",
                        "User Flow & Content Optimization",
                        "Domain & Hosting Management"
                    ]
                },
                {
                    title: "Social & Branding",
                    items: [
                        "Complete Business Setup Across Platforms",
                        "Brand Consistency Guidelines",
                        "Profile Visual Optimization"
                    ]
                },
                {
                    title: "Content & Marketing",
                    items: [
                        "15 Premium Contents Per Month",
                        "Content Calendar Planning",
                        "FB & Instagram Ad Campaign Setup",
                        "Basic Audience Targeting"
                    ]
                },
                {
                    title: "Report & Support",
                    items: [
                        "Monthly Performance Report",
                        "Regular Technical & Marketing Support"
                    ]
                }
            ]
        },
        {
            name: "Pro",
            price: "৳21,000 / month",
            sections: [
                {
                    title: "Advanced Web System",
                    items: [
                        "Fully Branded Scale-ready Website",
                        "Advanced Performance Tuning",
                        "Security & Regular Maintenance"
                    ]
                },
                {
                    title: "Full Brand Presence",
                    items: [
                        "Professional Setup on All Social Platforms",
                        "Brand Positioning Strategy"
                    ]
                },
                {
                    title: "Advanced Content & Ads",
                    items: [
                        "20 High-end Contents Per Month",
                        "Full Ad Campaign Management",
                        "Custom Audience & Retargeting"
                    ]
                },
                {
                    title: "Growth & Support",
                    items: [
                        "Monthly Growth Analysis",
                        "Priority Support",
                        "Dedicated Business Growth Guidance"
                    ]
                }
            ]
        }
    ]
};

export const FAQS = {
    bn: [
        { question: "কন্টেন্টগুলো কি প্রিমিয়াম মানের হবে?", answer: "অবশ্যই। আমরা আপনার ব্র্যান্ডের জন্য কাস্টম এবং হাই-ইমপ্যাক্ট কন্টেন্ট তৈরি করি যা মানুষের নজর কাড়বেই।" },
        { question: "৭ দিনে কি সত্যি সম্ভব?", answer: "হ্যাঁ, অবিশ্বাস্য গতিতে আমাদের টিম কাজ করে যাতে আপনি দ্রুত রেজাল্ট পান।" },
        { question: "অ্যাড বাজেট কি প্যাকেজে অন্তর্ভুক্ত?", answer: "হ্যাঁ, উল্লিখিত অ্যাড বাজেট প্যাকেজের অংশ হিসেবে আমরা ম্যানেজ করি।" }
    ],
    en: [
        { question: "Will the content be premium quality?", answer: "Absolutely. We craft custom, high-impact content designed to stop the scroll and hook your audience." },
        { question: "Is 7 days actually possible?", answer: "Yes, we work at incredible speed to ensure your brand goes live and starts performing as quickly as possible." },
        { question: "Is ad budget included?", answer: "Yes, the mentioned ad budget is managed by us as part of your subscription package." }
    ]
};
