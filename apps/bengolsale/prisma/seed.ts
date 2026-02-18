import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding BengolSale products...");

    const brandId = "bengolsale";

    // Upsert the brand just in case
    await prisma.brand.upsert({
        where: { id: brandId },
        update: { name: "BengolSale", slug: "bengolsale" },
        create: { id: brandId, name: "BengolSale", slug: "bengolsale" },
    });

    const products = [
        {
            id: "regular-tshirt",
            name: "Regular T-shirt",
            description: "Premium Regular Fit T-shirt made with 100% cotton.",
            price: 250,
            imageUrl: "/products/grey.png",
            category: "T-shirt",
            brandId: brandId,
            hasVariants: true,
            isPack: false,
            variants: {
                stock: {
                    Olive: { M: 0, L: 0, XL: 3 },
                    grey: { M: 0, L: 100, XL: 60 },
                    Blue: { M: 0, L: 98, XL: 55 },
                },
            },
        },
        {
            id: "drop-solder-tshirt",
            name: "Drop Solder T-shirt",
            description: "Stylish Drop Solder Fit T-shirt for a modern look.",
            price: 350,
            imageUrl: "/products/khaki.png",
            category: "T-shirt",
            brandId: brandId,
            hasVariants: true,
            isPack: false,
            variants: {
                stock: {
                    Khaki: { M: 25, L: 148, XL: 95 },
                    black: { M: 0, L: 28, XL: 5 },
                    Lemon: { M: 29, L: 152, XL: 94 },
                },
            },
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: product,
            create: product,
        });
    }

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
