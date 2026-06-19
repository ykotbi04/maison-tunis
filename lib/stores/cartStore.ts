// Optimized Cart Store with Granular Selectors

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState, CartActions, CartSelectors } from '@/types/cart'

interface CartStore extends CartState, CartActions, CartSelectors {}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Actions
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      // Selectors
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getItemById: (id: string) => {
        return get().items.find((i) => i.id === id)
      },

      hasItem: (id: string) => {
        return get().items.some((i) => i.id === id)
      },
    }),
    {
      name: 'maison-tunis-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Granular selectors to prevent unnecessary re-renders
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartTotalPrice = () => useCartStore((state) => state.getTotalPrice())
export const useCartTotalItems = () => useCartStore((state) => state.getTotalItems())

// Individual action selectors to avoid infinite loop
export const useAddCartItem = () => useCartStore((state) => state.addItem)
export const useRemoveCartItem = () => useCartStore((state) => state.removeItem)
export const useUpdateCartQuantity = () => useCartStore((state) => state.updateQuantity)
export const useClearCart = () => useCartStore((state) => state.clearCart)

// Individual selector functions to avoid infinite loop
export const useGetCartItemById = () => useCartStore((state) => state.getItemById)
export const useHasCartItem = () => useCartStore((state) => state.hasItem)
