import { Gem, Maximize, Palette, Zap } from 'lucide-react';
import { FAQItem, ProductColor } from './types';

export const COLORS: ProductColor[] = [
  { id: 'black', name: 'Kalo (Black)', hex: '#000000', image: '/products/black.png' },
  { id: 'khaki', name: 'Khaki', hex: '#C3B091', image: '/products/khaki.png' },
  { id: 'lemon', name: 'Lemon', hex: '#FFF44F', image: '/products/lemon.png' },
  { id: 'blue', name: 'Blue', hex: '#1E40AF', image: '/products/blue.png' },
  { id: 'olive', name: 'Olive', hex: '#556B2F', image: '/products/olive.png' },
  { id: 'grey', name: 'Gray', hex: '#9CA3AF', image: '/products/grey.png' },
];

export const SIZES = ['M', 'L', 'XL'];

export const FEATURES = [
  { title: 'প্রিমিয়াম ফেব্রিক', description: 'সফট ও কমফোর্টেবল Cotton Blend ফ্যাব্রিক।', icon: Gem },
  { title: 'কালার গ্যারান্টি', description: 'বারবার ধুলেও রঙ উঠে যাওয়ার ভয় নেই (৯০-৯৫% কালার ম্যাচ)।', icon: Palette },
  { title: 'আরামদায়ক ফিট', description: 'গরম এবং রোজকার ব্যবহারের জন্য আরামদায়ক।', icon: Maximize },
  { title: 'লং-লাস্টিং প্রিন্ট', description: 'হাই-ডেনসিটি কোয়ালিটির প্রিন্ট, সহজে নষ্ট হয় না।', icon: Zap },
];

export const FAQS: FAQItem[] = [
  { question: 'এই টি-শার্টটা কি ধরনের ফ্যাব্রিক দিয়ে তৈরি?', answer: 'এটি প্রিমিয়াম কোয়ালিটির সফট ও কমফোর্টেবল Cotton Blend ফ্যাব্রিক দিয়ে তৈরি, যা গরমে এবং রোজকার ব্যবহার—দুই ক্ষেত্রেই আরামদায়ক।' },
  { question: 'প্রিন্ট কি লং-লাস্টিং?', answer: 'হ্যাঁ, এতে হাই-ডেনসিটি কোয়ালিটির প্রিন্ট ব্যবহার করা হয়েছে। বারবার ধুলেও সহজে নষ্ট হয় না।' },
  { question: 'রং কি একই রকম থাকবে?', answer: 'ছবির সাথে ৯০–৯৫% মিল থাকবে। আলো বা স্ক্রিন রেজোলিউশনের কারণে সামান্য পার্থক্য হতে পারে।' },
  { question: 'কত দিনের মধ্যে পাবো?', answer: '২-৩ দিনের মধ্যে সারা বাংলাদেশে পেয়ে যাবেন।' },
  { question: 'অর্ডার করার নিয়ম কী?', answer: 'ইনবক্সে নাম, ঠিকানা, নম্বর এবং সাইজ পাঠালেই অর্ডার কনফার্ম হয়ে যাবে (অথবা ওয়েবসাইট থেকে সরাসরি অর্ডার করুন)।' },
  { question: 'ডেলিভারি চার্জ কত?', answer: 'সারা বাংলাদেশে ১৩০ টাকা, চট্টগ্রাম এর ভিতর ৮০ টাকা। ৩ পিস বা তার বেশি কিনলে ডেলিভারি একদম ফ্রি!' },
];
