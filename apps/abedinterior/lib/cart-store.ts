import { create } from "zustand";
import { persist } from "zustand/middleware";
interface CartItem {
  id: string;
  originalId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize?: string;
  selectedColor?: string;
}
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (
    id: string,
    selectedSize?: string,
    selectedColor?: string,
  ) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string,
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (i) =>
            i.id === item.id &&
            i.selectedSize === item.selectedSize &&
            i.selectedColor === item.selectedColor,
        );
        if (existingItemIndex > -1) {
          const newItems = items.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i,
          );
          set({ items: newItems });
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] });
        }
      },
      removeItem: (id, selectedSize, selectedColor) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
              ),
          ),
        });
      },
      updateQuantity: (id, quantity, selectedSize, selectedColor) => {
        if (quantity <= 0) {
          get().removeItem(id, selectedSize, selectedColor);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
