// Wishlist Store

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '@/types/user'

interface WishlistState {
  items: WishlistItem[]
}

interface WishlistActions {
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  clearWishlist: () => void
}

interface WishlistStore extends WishlistState, WishlistActions {}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        set((state) => {
          if (state.items.some((item) => item.productId === productId)) {
            return state
          }
          return {
            items: [...state.items, { productId, addedAt: new Date() }],
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      hasItem: (productId: string) => {
        return get().items.some((item) => item.productId === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'maison-tunis-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Granular selectors
export const useWishlistItems = () => useWishlistStore((state) => state.items)

// Individual action selectors to avoid infinite loop
export const useAddWishlistItem = () => useWishlistStore((state) => state.addItem)
export const useRemoveWishlistItem = () => useWishlistStore((state) => state.removeItem)
export const useHasWishlistItem = () => useWishlistStore((state) => state.hasItem)
export const useClearWishlist = () => useWishlistStore((state) => state.clearWishlist)
