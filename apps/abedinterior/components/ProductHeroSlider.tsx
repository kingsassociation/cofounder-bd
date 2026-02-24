"use client";
import { parseDescription } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string | null;
}
interface ProductHeroSliderProps {
  products: Product[];
}
const ProductHeroSlider = ({ products }: ProductHeroSliderProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products
    .filter((product) => product.imageUrl && product.quantity > 0)
    .slice(0, 5);
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  const handleShopNow = (productId: string) => {
    router.push(`/shop/${productId}`);
  };
  const handleExplore = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };
  if (featuredProducts.length === 0) {
    return null;
  }
  return (
    <div className="overflow-hidden relative w-full px-4 md:px-6 py-8">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-br from-gray-50 via-white to-gray-50 py-10 md:py-16 md:px-16 px-6 rounded-2xl min-w-full shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            {}
            <div className="md:pl-8 mt-8 md:mt-0 flex-1">
              {product.category && (
                <p className="md:text-base text-gray-500 pb-2 font-semibold uppercase tracking-wider text-sm animate-fade-in">
                  {product.category}
                </p>
              )}
              <h1 className="max-w-lg md:text-[56px] md:leading-[64px] text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-md line-clamp-3 leading-relaxed mb-6 font-medium">
                {parseDescription(product.description).summary}
              </p>
              {}
              <div className="mt-6 md:mt-8">
                <span className="text-4xl md:text-5xl font-bold text-brand-600">
                  ৳{product.price.toFixed(2)}
                </span>
              </div>
              {}
              <div className="flex items-center mt-6 md:mt-8 gap-4">
                <button
                  onClick={() => handleShopNow(product.id)}
                  className="md:px-10 px-8 md:py-3.5 py-3 bg-brand-600 rounded-full text-white font-semibold hover:bg-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Shop Now
                </button>
                <button
                  onClick={handleExplore}
                  className="group flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 hover:text-brand-600 transition-all duration-300 hover:gap-3"
                >
                  View All
                  <svg
                    className="group-hover:translate-x-1 transition-transform w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {}
            <div className="flex items-center flex-1 justify-center relative">
              <div className="relative w-full max-w-md md:max-w-lg">
                {}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-52 h-52 md:w-80 md:h-80 bg-white rounded-full shadow-2xl"></div>
                </div>
                {}
                <div className="relative h-64 md:h-96 transition-transform duration-500 hover:scale-105">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain relative z-10 drop-shadow-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={
                      currentSlide ===
                      featuredProducts.findIndex((p) => p.id === product.id)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {}
      <div className="flex items-center justify-center gap-2.5 mt-10">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index
                ? "bg-brand-600 w-8 shadow-sm"
                : "bg-gray-200 w-2 hover:bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
export default ProductHeroSlider;
