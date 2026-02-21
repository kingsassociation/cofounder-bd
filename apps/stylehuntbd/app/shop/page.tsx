import ProductCard from "@/components/ProductCard";
import SearchTracking from "@/components/SearchTracking";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { prisma } from "@/lib/prisma";
import { flattenProducts } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const minPrice =
    typeof searchParams.minPrice === "string"
      ? parseFloat(searchParams.minPrice)
      : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string"
      ? parseFloat(searchParams.maxPrice)
      : undefined;
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const limit = 40; // Since we flatten, we handle pagination differently if we wanted perfect pages, but for now let's just fetch more categories
  const skip = (page - 1) * limit;
  const where: any = { brandId: "stylehuntbd" };
  if (category) {
    where.category = category;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name_asc") orderBy = { name: "asc" };
  
  const [groupedProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: skip,
      include: {
        images: {
          select: {
            color: true,
            url: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const products = flattenProducts(groupedProducts);
  const totalPages = Math.ceil(totalCount / limit);
  const categoriesRaw = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { brandId: "stylehuntbd", category: { not: null } },
  });
  const categories = categoriesRaw
    .map((c) => c.category)
    .filter((c): c is string => !!c);
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop Application</h1>
          <Suspense fallback={null}>
            <SearchTracking />
          </Suspense>
          {}
          <form
            action="/shop"
            method="GET"
            className="relative hidden md:block"
          >
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              defaultValue={query}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            {}
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
          </form>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSidebar categories={categories} />
          </div>
          {}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {page > 1 && (
                      <Link
                        href={`/shop?page=${page - 1}${category ? `&category=${category}` : ""}${query ? `&q=${query}` : ""}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    <span className="px-4 py-2 text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={`/shop?page=${page + 1}${category ? `&category=${category}` : ""}${query ? `&q=${query}` : ""}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
