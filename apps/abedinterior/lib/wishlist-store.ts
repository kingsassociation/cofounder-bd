import { create } from "zustand";
import { persist } from "zustand/middleware";
interface WishlistStore {
  wishlistIds: string[];
  isLoading: boolean;
  isInitialized: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  setWishlistIds: (ids: string[]) => void;
  reset: () => void;
}
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      isLoading: false,
      isInitialized: false,
      setWishlistIds: (ids) => set({ wishlistIds: ids, isInitialized: true }),
      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/user/wishlist");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const ids = data.map((item: any) => item.productId);
              set({ wishlistIds: ids, isInitialized: true });
            }
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      toggleWishlist: async (productId) => {
        const { wishlistIds } = get();
        const exists = wishlistIds.includes(productId);
        if (exists) {
          set({ wishlistIds: wishlistIds.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...wishlistIds, productId] });
        }
        try {
          const res = await fetch("/api/user/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          if (!res.ok) {
            set({ wishlistIds });
            const data = await res.json();
            throw new Error(data.error || "Failed to toggle wishlist");
          }
        } catch (error) {
          set({ wishlistIds });
          console.error("Error toggling wishlist:", error);
          throw error;
        }
      },
      isInWishlist: (productId) => {
        return get().wishlistIds.includes(productId);
      },
      reset: () => set({ wishlistIds: [], isInitialized: false }),
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ wishlistIds: state.wishlistIds }),
    },
  ),
);
