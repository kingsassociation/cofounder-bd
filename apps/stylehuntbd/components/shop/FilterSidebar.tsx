"use client";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
interface FilterSidebarProps {
  categories: string[];
}
export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [isOpen, setIsOpen] = useState(false);
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  };
  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    router.push("/shop");
    setIsOpen(false);
  };
  return (
    <>
      <button
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm w-full mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={20} />
        <span>Filters & Sort</span>
      </button>
      <div
        className={`md:block ${isOpen ? "block" : "hidden"} bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8`}
      >
        <div className="flex items-center justify-between md:hidden mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        {}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
            Category
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={() => setSelectedCategory("")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span
                className={`text-sm ${selectedCategory === "" ? "text-blue-600 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
              >
                All Categories
              </span>
            </label>
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${selectedCategory === cat ? "text-blue-600 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
        {}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
            Price Range
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        {}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
            Sort By
          </h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>
        {}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={applyFilters}
            className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="w-full py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  );
}
