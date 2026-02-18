export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export type ProductSize = 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  color: string;
  size: ProductSize;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  hasVariants: boolean;
  isPack: boolean;
  variants: {
    stock: Record<string, Record<string, number>>;
  };
}

export interface BundleSelection {
  productId: string;
  name: string;
  color: string;
  size: ProductSize;
  imageUrl: string;
}

export interface CartItem {
  id: string; // unique selection id
  productId?: string; // Optional for bundles
  name: string;
  color?: string; // Optional for bundles
  size?: ProductSize; // Optional for bundles
  quantity: number;
  price: number;
  imageUrl: string;
  isBundle?: boolean;
  bundleItems?: BundleSelection[];
}

export interface Combo {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isPack: boolean;
  color?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
}
