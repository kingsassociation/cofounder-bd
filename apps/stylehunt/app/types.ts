export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export type ProductSize = string;

export interface Combo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isPack: boolean;
  color?: string;
  category?: string;
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
