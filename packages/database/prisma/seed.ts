import { prisma } from "../index";

async function main() {
    console.log("Seeding brands...");

    const brands = [
        {
            id: "tuhinscollections",
            name: "Tuhins Collections",
            slug: "tuhinscollections",
            domain: "tuhinscollections.com",
        },
        {
            id: "fruits-zone",
            name: "Fruits Zone",
            slug: "fruits-zone",
            domain: "fruits-zone.com",
        },
        {
            id: "stylehunt",
            name: "StyleHunt",
            slug: "stylehunt",
            domain: "stylehunt.com",
        },
        {
            id: "bengolsale",
            name: "BengolSale",
            slug: "bengolsale",
            domain: "bengolsale.com",
        },
        {
            id: "raafidan",
            name: "Raafidan",
            slug: "raafidan",
            domain: "raafidan.com",
        },
    ];

    for (const brand of brands) {
        await prisma.brand.upsert({
            where: { id: brand.id },
            update: brand,
            create: brand,
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
    });
