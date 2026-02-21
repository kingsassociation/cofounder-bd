import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    console.log('Starting migration...')

    // 1. Ensure Brands exist
    const brands = [
        { id: 'bengolsale', name: 'BengolSale', slug: 'bengolsale' },
        { id: 'stylehunt', name: 'StyleHunt', slug: 'stylehunt' },
        { id: 'fruits-zone', name: 'Fruits Zone', slug: 'fruits-zone' },
        { id: 'tuhinscollectionsectionsections', name: 'Tuhins Collections', slug: 'tuhinscollections' },
    ]

    for (const brand of brands) {
        await prisma.brand.upsert({
            where: { id: brand.id },
            update: {},
            create: brand,
        })
    }

    // 2. BengolSale Products
    const BENGOL_COLORS = [
        { id: 'black', name: 'Kalo (Black)', image: '/products/black.png' },
        { id: 'khaki', name: 'Khaki', image: '/products/khaki.png' },
        { id: 'lemon', name: 'Lemon', image: '/products/lemon.png' },
        { id: 'blue', name: 'Blue', image: '/products/blue.png' },
        { id: 'olive', name: 'Olive', image: '/products/olive.png' },
        { id: 'grey', name: 'Gray', image: '/products/grey.png' },
    ]

    const BENGOL_PRODUCTS = [
        { id: 'pack-6', name: '৬ পিস কম্বো প্যাক', price: 1350, imageUrl: '/products/pack-6.png', description: 'সেরা ভ্যালু প্যাক - সব কালারের মিক্স (Size: M, L, XL)', isPack: true },
        { id: 'pack-3', name: '৩ পিস কম্বো প্যাক', price: 750, imageUrl: '/products/pack-3.png', description: '৩টি প্রিমিয়াম টি-শার্টের কম্বো (Size: M, L, XL)', isPack: true },
        ...BENGOL_COLORS.map(c => ({
            id: c.id,
            name: `${c.name} Single`,
            price: 250,
            imageUrl: c.image,
            description: '১টি প্রিমিয়াম টি-শার্ট',
            isPack: false,
        }))
    ]

    for (const p of BENGOL_PRODUCTS) {
        await prisma.product.upsert({
            where: { id: p.id },
            update: { ...p, brandId: 'bengolsale' },
            create: { ...p, brandId: 'bengolsale' },
        })
    }

    // 3. StyleHunt Products
    const HEJEL_NAMES = [
        'Ash Graphite Grey', 'Blush Pink (2)', 'Blush Pink', 'Creamy White & Peach Floral',
        'Deep Plum Purple', 'Ice Blue', 'Lavender Beige', 'Lilac Lavender',
        'Mint Sage & Soft Coral', 'Mint Snow', 'Misty Grey Beige', 'Peach Rose',
        'Peach Sherbet', 'Pink', 'Powder Blue & Rose Mist', 'Sage Green Pastel',
        'Soft Beige & Pink Floral', 'Teal Green', 'Warm Taupe Mauve'
    ]

    const STYLEHUNT_PRODUCTS = [
        { id: 'sh-pack-6', name: '6 Piece Combo Pack', price: 6000, imageUrl: '/products/pack-6.png', description: 'Best Value Pack - Any 6 Pieces', isPack: true },
        { id: 'sh-pack-3', name: '3 Piece Combo Pack', price: 3050, imageUrl: '/products/pack-3.png', description: 'Premium Dress Combo - Any 3 Pieces', isPack: true },
        ...HEJEL_NAMES.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: `${name} Hejel`,
            price: 1050,
            imageUrl: `/products/${name}.png`,
            description: 'Fabric: Cotton | Size: Free Size | Set: Kameez, Salwar & Dupatta',
            isPack: false,
        }))
    ]

    for (const p of STYLEHUNT_PRODUCTS) {
        await prisma.product.upsert({
            where: { id: p.id },
            update: { ...p, brandId: 'stylehunt' },
            create: { ...p, brandId: 'stylehunt' },
        })
    }

    // 4. Fruits Zone Products
    const FRUITS = [
        {
            id: "sukkeri-dates",
            name: "Sukkeri Dates",
            description: "সু্ক্রি খেজুর অত্যন্ত মিষ্টি ও নরম। যারা খুব মিষ্টি খেজুর পছন্দ করেন তাদের জন্য এটি সেরা।",
            imageUrl: "/products/sukkari.png",
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
            imageUrl: "/products/medjool.png",
            category: "Jordan",
            variants: [
                { weight: "500g", price: 800, oldPrice: 1000 },
                { weight: "1kg", price: 1500, oldPrice: 1800 },
            ],
        },
    ]

    // Clear old Fruits Zone products to "keep" only the requested ones
    await prisma.product.deleteMany({
        where: { brandId: 'fruits-zone' }
    });
    console.log('Cleared old Fruits Zone products.');

    for (const f of FRUITS) {
        await prisma.product.upsert({
            where: { id: f.id },
            update: {
                name: f.name,
                description: f.description,
                imageUrl: f.imageUrl,
                category: f.category,
                price: f.variants[0].price, // Default price
                variants: f.variants as any,
                brandId: 'fruits-zone',
            },
            create: {
                id: f.id,
                name: f.name,
                description: f.description,
                imageUrl: f.imageUrl,
                category: f.category,
                price: f.variants[0].price,
                variants: f.variants as any,
                brandId: 'fruits-zone',
            },
        })
    }

    console.log('Migration complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
