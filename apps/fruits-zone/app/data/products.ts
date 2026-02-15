export type ProductVariant = {
    weight: string;
    price: number;
    oldPrice?: number;
};

export type ProductFamily = {
    id: string;
    name: string;
    description: string;
    image: string;
    category?: string;
    variants: ProductVariant[];
};

export const products: ProductFamily[] = [
    {
        id: "sukkeri-dates",
        name: "Sukkeri Dates",
        description: "সু্ক্রি খেজুর অত্যন্ত মিষ্টি ও নরম। যারা খুব মিষ্টি খেজুর পছন্দ করেন তাদের জন্য এটি সেরা।",
        image: "/products/sukkari.png",
        category: "Saudi Arabia",
        variants: [
            { weight: "500g", price: 550, oldPrice: 650 },
            { weight: "1kg", price: 1000, oldPrice: 1200 },
        ],
    },
    {
        id: "medjool-dates",
        name: "Medjool Dates",
        description: "মরুর রাজা মেজজুল খেজুর। রাজকীয় স্বাদ এবং বড় আকারের জন্য এটি জগদ্বিখ্যাত।",
        image: "/products/medjool.png",
        category: "Jordan",
        variants: [
            { weight: "500g", price: 800, oldPrice: 1000 },
            { weight: "1kg", price: 1500, oldPrice: 1800 },
        ],
    },
];
