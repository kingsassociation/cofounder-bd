import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductHeroSlider from "@/components/ProductHeroSlider";
import { prisma } from "@/lib/prisma";
import { flattenProducts, VirtualProduct } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";

const getFeaturedProducts = unstable_cache(
  async () => {
    return await prisma.product.findMany({
      where: {
        brandId: "stylehuntbd",
        imageUrl: { not: "" },
        quantity: { gt: 0 },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  },
  ["featured-products"],
  { revalidate: 3600, tags: ["products"] },
);

const getProductsByCategory = unstable_cache(
  async () => {
    const categories = await prisma.product.findMany({
      where: { brandId: "stylehuntbd", category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    });

    const productsByCategory: Record<string, VirtualProduct[]> = {};

    for (const cat of categories) {
      if (!cat.category) continue;
      const groupedProducts = await prisma.product.findMany({
        where: { brandId: "stylehuntbd", category: cat.category },
        orderBy: { createdAt: "desc" },
        take: 8, 
        include: {
          images: {
            select: {
              color: true,
              url: true,
            },
          },
        },
      });
      productsByCategory[cat.category] = flattenProducts(groupedProducts);
    }

    return productsByCategory;
  },
  ["products-by-category"],
  { revalidate: 600, tags: ["products"] },
);

export default async function Home() {
  const [featuredProducts, categoriesWithProducts] = await Promise.all([
    getFeaturedProducts(),
    getProductsByCategory(),
  ]);

  const categoryEntries = Object.entries(categoriesWithProducts);

  return (
    <main className="min-h-screen">
      <ProductHeroSlider products={featuredProducts} />
      
      <section id="products" className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        {categoryEntries.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white border border-gray-200 inline-block px-8 py-6 rounded-xl shadow-sm">
              <p className="text-xl text-gray-900 mb-2">
                No products available yet
              </p>
              <p className="text-sm text-gray-600">
                Please add your NeonDB connection string and run the seed script
              </p>
            </div>
          </div>
        ) : (
          categoryEntries.map(([category, products]) => (
            <div key={category} className="space-y-8">
              <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    {category} <span className="gradient-text-light">Collection</span>
                  </h2>
                  <p className="text-gray-500 mt-2">Discover our latest {category.toLowerCase()} arrivals</p>
                </div>
                <Link 
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
      
      <Footer />
    </main>
  );
}
