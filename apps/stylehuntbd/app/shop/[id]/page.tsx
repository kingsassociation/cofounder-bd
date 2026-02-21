import ProductMainSection from "@/components/product/ProductMainSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductTabs from "@/components/ProductTabs";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

const getProduct = unstable_cache(
  async (id: string) => {
    return await prisma.product.findUnique({
      where: { id, brandId: "stylehuntbd" },
      include: {
        images: true,
      },
    });
  },
  ["product-detail"],
  { revalidate: 600, tags: ["products"] },
);

const getReviewStats = unstable_cache(
  async (productId: string) => {
    const aggregations = await prisma.review.aggregate({
      where: { productId },
      _count: true,
      _avg: {
        rating: true,
      },
    });
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true, id: true },
      take: 100,
    });
    return { aggregations, reviews };
  },
  ["review-stats"],
  { revalidate: 300, tags: ["reviews"] },
);

const getRelatedProducts = unstable_cache(
  async (category: string | null, productId: string) => {
    // 1. Fetch products from the same category (excluding current)
    const sameCategory = await prisma.product.findMany({
      where: {
        category,
        brandId: "stylehuntbd",
        id: { not: productId },
        quantity: { gt: 0 },
      },
      take: 4,
      include: { images: true },
    });

    // 2. Fetch products from other categories (to ensure variety)
    const otherCategories = await prisma.product.findMany({
      where: {
        category: { not: category },
        brandId: "stylehuntbd",
        id: { not: productId },
        quantity: { gt: 0 },
      },
      take: 8,
      include: { images: true },
    });

    // Combine them, same category first but limited
    const allRelated = [...sameCategory, ...otherCategories];
    return allRelated;
  },
  ["related-products-v2"], // Use new key to clear possible stale state
  { revalidate: 3600, tags: ["products"] },
);

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string; variant?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const productId = params.id;
  
  const initialColor = typeof searchParams?.color === "string" ? searchParams.color : undefined;
  const isVariantMode = searchParams?.variant === "true";

  const [product, stats] = await Promise.all([
    getProduct(productId),
    getReviewStats(productId),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, productId);

  const productWithReviews = {
    ...product,
    reviews: stats.reviews,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <ProductMainSection 
          product={productWithReviews} 
          initialColor={initialColor}
          onlyVariant={isVariantMode}
        />
        
        <ProductTabs
          product={productWithReviews}
          reviewCount={stats.aggregations._count}
        />

        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
