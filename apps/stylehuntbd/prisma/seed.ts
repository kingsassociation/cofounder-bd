import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = {
  'Afgani Silk': {
    price: 2200,
    names: ['Ash Gray', 'Charcoal', 'Coral Pink', 'Dark cyan', 'Dark red', 'Dusty Pruple', 'Golden Yellow', 'Light Brown', 'Light Cyan', 'Magenta', 'Paste pink', 'Paster Green', 'pink', 'Salmon Pink']
  },
  'Evani': {
    price: 1800,
    names: ['Black', 'Cool gray', 'Cyan', 'Dark Purple', 'Deep Red', 'Golden Brown', 'Golden Yellow', 'Jet Black', 'Maroon', 'pine Green', 'Raspberry Rose', 'Red Orange']
  },
  'Hejel': {
    price: 1050,
    names: ['Ash Graphite Grey', 'Blush Pink (2)', 'Blush Pink', 'Creamy White & Peach Floral', 'Deep Plum Purple', 'Ice Blue', 'Lavender Beige', 'Lilac Lavender', 'Mint Sage & Soft Coral', 'Mint Snow', 'Misty Grey Beige', 'Peach Rose', 'Peach Sherbet', 'Pink', 'Powder Blue & Rose Mist', 'Sage Green Pastel', 'Soft Beige & Pink Floral', 'Teal Green', 'Warm Taupe Mauve']
  },
  'Joipuri': {
    price: 1200,
    names: ['Black & White', 'Black', 'Burnt Umber', 'Crimson Coral & White', 'Dark Cayan', 'Dark pink', 'Dark yellow & White', 'Deep Teal & White', 'Gray & white', 'light pink', 'Olive Moss & White', 'Orange & White', 'Oxblood', 'Pink & White', 'Pink', 'White & Orange', 'White & Yellow', 'Yellow & White']
  },
  'Muslim': {
    price: 1200,
    names: ['Dark Burgundy', 'Dark Chocolate Brown', 'Dark Red-Recovered', 'Deep Red-Recovered', 'Dusty Orange-Recovered', 'Green-Recovered', 'light orange-Recovered', 'light pink', 'Pale Yellow']
  },
  'Pakija': {
    price: 1200,
    names: ['Amber Brown', 'black & Dark red', 'Black & Olive', 'Black & Red', 'Black', 'Burgundy', 'Cerise', 'coffe & orange', 'Dark Nevy', 'Midnight Blue', 'Mustard Yellow', 'Red Orange', 'Sage Green', 'Teal Blue']
  },
  'Starjhorjet': {
    price: 2000,
    names: ['Dark Teal', 'Deep Rose', 'Dusty Rose', 'Golden Brown']
  },
  'Zamzam loan': {
    price: 1500,
    names: ['Blue', 'burgundy red', 'charcoal black', 'Dark Brown', 'dark cherry', 'dark chocolate', 'dark moss', 'dark olive green', 'deep ocean teal', 'deep rose', 'Espresso Brown', 'Forest Green', 'indigo', 'Olive Green', 'Scarlet Red', 'sunset orange', 'Teal Gray', 'tomato red', 'Vintage Brown', 'wine berry']
  }
};

async function main() {
  console.log('Starting category-based grouped re-seed for StyleHunt BD...');

  // 1. Upsert Brand
  await prisma.brand.upsert({
    where: { id: 'stylehuntbd' },
    update: { name: 'StyleHunt BD', slug: 'stylehuntbd' },
    create: { id: 'stylehuntbd', name: 'StyleHunt BD', slug: 'stylehuntbd' },
  });

  // 2. Clear StyleHunt BD products and their related images
  const existingProducts = await prisma.product.findMany({
    where: { brandId: 'stylehuntbd' },
    select: { id: true }
  });
  const productIds = existingProducts.map(p => p.id);

  if (productIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: { in: productIds } }
    });
    await prisma.product.deleteMany({
      where: { brandId: 'stylehuntbd' }
    });
  }
  console.log(`Cleared ${productIds.length} existing products for stylehuntbd.`);

  // 3. Seed Products by Category (Grouped)
  for (const [categoryName, data] of Object.entries(CATEGORIES)) {
    const productId = `shbd-cat-${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const variantsData = data.names.map(name => ({
      color: name.replace('-Recovered', '').replace(' (2)', '').trim(),
      imageUrl: `/products/${categoryName}/${name}.png`,
      quantity: 20
    }));

    const totalQuantity = variantsData.reduce((sum, v) => sum + v.quantity, 0);
    const firstImage = variantsData[0].imageUrl;
    const colors = Array.from(new Set(variantsData.map(v => v.color)));

    await prisma.product.create({
      data: {
        id: productId,
        brandId: 'stylehuntbd',
        name: `${categoryName} Collection`,
        description: `[Specifications]\nFabric: ${categoryName}\nDesign: Premium Modest Wear\nSet Includes: 3-Piece Set (Kameez, Salwar, Dupatta)\nSize: Free Size (Fits most)\n\n[Description]\nThe ${categoryName} Collection from StyleHunt BD features premium modest wear sets. Each pieces is crafted with attention to detail and high-quality fabric, available in a variety of elegant colors.`,
        price: data.price,
        quantity: totalQuantity,
        imageUrl: firstImage,
        category: categoryName,
        size: ['Free Size'],
        color: colors,
        hasVariants: true,
        variants: variantsData as any,
        images: {
          create: variantsData.map((v, i) => ({
            id: `${productId}-img-${i}`,
            url: v.imageUrl,
            color: v.color
          }))
        }
      },
    });
    console.log(`✓ Created Grouped Collection: ${categoryName} (${variantsData.length} variants)`);
  }

  console.log('Grouped seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });