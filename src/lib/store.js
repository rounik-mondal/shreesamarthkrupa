import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      // 1. ROBUST ADD ITEM (Fixes your crash)
      addItem: (product) => {
        const { items } = get();
        
        // Check if item already exists (matching ID and Customizations)
        // We use JSON.stringify to compare the 'customization' object
        const existingItem = items.find(
          (item) => item.productId === product.id && 
                    JSON.stringify(item.customization) === JSON.stringify(product.customization || {})
        );

        if (existingItem) {
          // If exists, just increase quantity
          const updatedItems = items.map((item) =>
            item.uniqueId === existingItem.uniqueId
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
          set({ items: updatedItems });
        } else {
          // FIX: Handle both 'image' (string) and 'images' (array) formats
          let imageUrl = '/placeholder.jpg';
          if (product.image) imageUrl = product.image;
          else if (product.images && product.images.length > 0) imageUrl = product.images[0];

          set({
            items: [
              ...items,
              {
                uniqueId: Date.now(), // Unique ID for every cart entry
                productId: product.id,
                name: product.name,
                image: imageUrl, // <--- CRASH FIXED HERE
                price: product.price,
                customization: product.customization || {},
                quantity: product.quantity || 1,
              },
            ],
          });
        }
      },

      // 2. NEW: Remove Item Control
      removeItem: (uniqueId) => {
        set({ items: get().items.filter((item) => item.uniqueId !== uniqueId) });
      },

      // 3. NEW: Update Quantity Control (+/-)
      updateQuantity: (uniqueId, action) => {
        const { items } = get();
        const updatedItems = items.map((item) => {
          if (item.uniqueId === uniqueId) {
            if (action === 'increase') return { ...item, quantity: item.quantity + 1 };
            if (action === 'decrease') return { ...item, quantity: Math.max(1, item.quantity - 1) };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);