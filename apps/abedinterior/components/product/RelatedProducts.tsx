import { flattenProducts } from "@/lib/utils";
import ProductCard from "../ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
  category: string | null;
  size: string[];
  color: string[];
  hasVariants: boolean;
  images: { color: string | null; url: string }[];
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  const allVirtuals = flattenProducts(products);
  
  // Filter to show unique products only
  const uniqueProducts: any[] = [];
  const seenIds = new Set();
  
  for (const v of allVirtuals) {
    if (!seenIds.has(v.originalId)) {
      uniqueProducts.push(v);
      seenIds.add(v.originalId);
    }
    if (uniqueProducts.length >= 4) break;
  }

  if (uniqueProducts.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            You May <span className="gradient-text-light">Also Like</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Similar and trending items for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {uniqueProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
