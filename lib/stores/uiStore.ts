// UI State Store - Separate from business logic

import { create } from 'zustand'

interface UIState {
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  loading: boolean
}

interface UIActions {
  setCartDrawerOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  toggleCartDrawer: () => void
  toggleMobileMenu: () => void
  toggleSearch: () => void
}

interface UIStore extends UIState, UIActions {}

export const useUIStore = create<UIStore>((set) => ({
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  loading: false,

  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setLoading: (loading) => set({ loading }),

  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
}))

// Granular selectors
export const useCartDrawerOpen = () => useUIStore((state) => state.cartDrawerOpen)
export const useMobileMenuOpen = () => useUIStore((state) => state.mobileMenuOpen)
export const useSearchOpen = () => useUIStore((state) => state.searchOpen)
export const useUILoading = () => useUIStore((state) => state.loading)

// Individual action selectors to avoid infinite loop
export const useSetCartDrawerOpen = () => useUIStore((state) => state.setCartDrawerOpen)
export const useSetMobileMenuOpen = () => useUIStore((state) => state.setMobileMenuOpen)
export const useSetSearchOpen = () => useUIStore((state) => state.setSearchOpen)
export const useSetLoading = () => useUIStore((state) => state.setLoading)
export const useToggleCartDrawer = () => useUIStore((state) => state.toggleCartDrawer)
export const useToggleMobileMenu = () => useUIStore((state) => state.toggleMobileMenu)
export const useToggleSearch = () => useUIStore((state) => state.toggleSearch)
