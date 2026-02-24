import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

/**
 * Abed Interior Dynamic Seed Script
 * Scans public/products/Wallpaper directory
 */

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BRAND_ID = 'abedinterior';
const BRAND_NAME = "Abed Interior";
const PRODUCTS_ROOT = path.join(__dirname, '../public/products/Wallpaper');

async function scanDirectory(dir: string, baseDir: string = PRODUCTS_ROOT): Promise<any[]> {
  const result: any[] = [];
  if (!fs.existsSync(dir)) return result;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && (entry.name.toLowerCase().endsWith('.png') || entry.name.toLowerCase().endsWith('.jpg'))) {
      const relativePath = path.relative(path.join(__dirname, '../public'), fullPath).replace(/\\/g, '/');
      const fileName = entry.name.replace(/\.[^/.]+$/, "");

      result.push({
        name: fileName,
        category: 'Wallpaper',
        path: `/${relativePath}`,
      });
    }
  }
  return result;
}

async function main() {
  console.log(`Starting dynamic re-seed for ${BRAND_NAME}...`);

  // 1. Upsert Brand
  await prisma.brand.upsert({
    where: { id: BRAND_ID },
    update: { name: BRAND_NAME, slug: BRAND_ID },
    create: { id: BRAND_ID, name: BRAND_NAME, slug: BRAND_ID },
  });

  // 2. Clear existing products for this brand
  const existingProducts = await prisma.product.findMany({
    where: { brandId: BRAND_ID },
    select: { id: true }
  });
  const productIds = existingProducts.map(p => p.id);

  if (productIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: { in: productIds } }
    });
    await prisma.product.deleteMany({
      where: { brandId: BRAND_ID }
    });
  }
  console.log(`Cleared ${productIds.length} existing products for ${BRAND_ID}.`);

  // 3. Scan and Group
  const files = await scanDirectory(PRODUCTS_ROOT);
  console.log(`Found ${files.length} images.`);

  if (files.length === 0) {
    console.log("No images found. Exiting.");
    return;
  }

  // Create one main Wallpaper Collection product with all images as variants
  const productId = `abed-wallpaper-collection`;
  const variantsData = files.map((item, i) => ({
    color: `Style ${item.name}`,
    imageUrl: item.path,
    quantity: 100
  }));

  const totalQuantity = variantsData.reduce((sum, v) => sum + v.quantity, 0);
  const firstImage = variantsData[0].imageUrl;
  const colors = variantsData.map(v => v.color);

  await prisma.product.create({
    data: {
      id: productId,
      brandId: BRAND_ID,
      name: `Embossed Textured Wallpaper`,
      description: `[Specifications]\nType: Embossed Textured Wallpaper\nSize: 54 sqf per roll\nMinimum Order: 10 rolls\n\n[Description]\nUpgrade your interior with our premium Embossed Textured Wallpaper. Highly durable, moisture-resistant, and aesthetically pleasing. Free installation provided with a minimum order of 10 rolls (within Chattogram Metropolitan).`,
      price: 1800,
      quantity: totalQuantity,
      imageUrl: firstImage,
      category: 'Wallpaper',
      size: ['54 sqf per roll'],
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
  console.log(`✓ Created Wallpaper Collection with ${variantsData.length} styles.`);

  console.log('Seed completed successfully!');
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