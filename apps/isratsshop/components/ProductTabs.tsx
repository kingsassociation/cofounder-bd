"use client";
import { useState } from "react";
import ReviewsTab from "./product/ReviewsTab";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string | null;
  size: string[];
  color: string[];
  hasVariants: boolean;
}
interface ProductTabsProps {
  product: Product;
  reviewCount?: number;
}
export default function ProductTabs({
  product,
  reviewCount,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const specifications = [
    { label: "Brand", value: product.category || "Tuhins Collections" },
    {
      label: "Product ID",
      value: `IS-${product.id.slice(-6).toUpperCase()}`,
    },
    {
      label: "Availability",
      value: product.quantity > 0 ? "In Stock" : "Out of Stock",
    },
    { label: "Weight", value: "500g" },
    { label: "Dimensions", value: "10 x 15 x 5 cm" },
    ...(product.size.length > 0
      ? [{ label: "Available Sizes", value: product.size.join(", ") }]
      : []),
    ...(product.color.length > 0
      ? [{ label: "Available Colors", value: product.color.join(", ") }]
      : []),
  ];
  const reviews = [
    {
      id: 1,
      name: "Sarah Ahmed",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Excellent product! The quality exceeded my expectations. Highly recommend!",
      verified: true,
    },
    {
      id: 2,
      name: "Mohammed Khan",
      rating: 4,
      date: "2024-01-10",
      comment: "Great value for money. Fast delivery and good packaging.",
      verified: true,
    },
    {
      id: 3,
      name: "Fatima Rahman",
      rating: 5,
      date: "2024-01-05",
      comment: "Love it! Perfect fit and amazing quality. Will buy again!",
      verified: true,
    },
  ];
  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm sm:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.id === "reviews" && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {reviewCount ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {}
      <div className="p-6 md:p-8">
        {}
        {activeTab === "description" && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Product Description
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.description}
            </p>
            <div className="prose prose-sm sm:prose max-w-none text-gray-600">
              <p>
                This premium product from Tuhins Collections offers exceptional quality
                and style. Carefully crafted with attention to detail, it
                combines functionality with modern design.
              </p>
              <h4 className="text-gray-900 font-semibold mt-6 mb-3">
                Key Features:
              </h4>
              <ul className="space-y-2">
                <li>High-quality materials for durability</li>
                <li>Modern and sleek design</li>
                <li>Perfect for everyday use</li>
                <li>Easy to maintain and clean</li>
                <li>Backed by our quality guarantee</li>
              </ul>
              <h4 className="text-gray-900 font-semibold mt-6 mb-3">
                Care Instructions:
              </h4>
              <ul className="space-y-2">
                <li>Follow the care label instructions</li>
                <li>Store in a cool, dry place</li>
                <li>Keep away from direct sunlight</li>
              </ul>
            </div>
          </div>
        )}
        {}
        {activeTab === "specifications" && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Technical Specifications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {spec.label}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {}
        {activeTab === "reviews" && <ReviewsTab productId={product.id} />}
      </div>
    </div>
  );
}
