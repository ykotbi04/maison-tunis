import { useCallback, useEffect } from 'react'
import { useAuthSession } from '@/hooks/useAuthSession'
import {
  useCartItems,
  useAddCartItem,
  useRemoveCartItem,
  useUpdateCartQuantity,
  useClearCart,
  useGetCartTotalPrice,
  useGetCartTotalItems,
  useGetCartItemById,
  useHasCartItem,
  useCartStore,
} from '@/lib/stores'
import { cartApi } from '@/lib/api'
import type { CartItem } from '@/types/cart'
import { MAX_QUANTITY_PER_ORDER, MIN_QUANTITY_PER_ORDER } from '@/lib/constants'

export function useCart() {
  const items = useCartItems()
  const addItem = useAddCartItem()
  const removeItem = useRemoveCartItem()
  const updateQuantity = useUpdateCartQuantity()
  const clearCart = useClearCart()
  const getTotalPrice = useGetCartTotalPrice()
  const getTotalItems = useGetCartTotalItems()
  const getItemById = useGetCartItemById()
  const hasItem = useHasCartItem()
  const { isAuthenticated } = useAuthSession()

  const syncCartFromServer = useCallback(async () => {
    try {
      const serverCart = await cartApi.get()
      useCartStore.setState({ items: serverCart })
    } catch {
      // Guest or unauthenticated — keep local cart
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      void syncCartFromServer()
    }
  }, [isAuthenticated, syncCartFromServer])

  const addToCart = useCallback(
    async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
      const cartItem: CartItem = { ...item, quantity }

      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.addItem(cartItem)
          useCartStore.setState({ items: serverCart })
          return
        } catch {
          // Fall back to local cart if API fails
        }
      }

      addItem(cartItem)
    },
    [addItem, isAuthenticated]
  )

  const removeFromCart = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.removeItem(id)
          useCartStore.setState({ items: serverCart })
          return
        } catch {
          // Fall back to local
        }
      }

      removeItem(id)
    },
    [isAuthenticated, removeItem]
  )

  const updateQuantityFn = useCallback(
    async (id: string, quantity: number) => {
      if (quantity < MIN_QUANTITY_PER_ORDER) {
        await removeFromCart(id)
        return
      }

      if (quantity > MAX_QUANTITY_PER_ORDER) {
        return
      }

      if (isAuthenticated) {
        try {
          const serverCart = await cartApi.updateItem(id, quantity)
          useCartStore.setState({ items: serverCart })
          return
        } catch {
          // Fall back to local
        }
      }

      updateQuantity(id, quantity)
    },
    [isAuthenticated, removeFromCart, updateQuantity]
  )

  const clearCartFn = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const serverCart = await cartApi.clear()
        useCartStore.setState({ items: serverCart })
        return
      } catch {
        // Fall back to local
      }
    }

    clearCart()
  }, [clearCart, isAuthenticated])

  const isInCart = useCallback(
    (id: string) => hasItem(id),
    [hasItem]
  )

  const getItemQuantity = useCallback(
    (id: string) => getItemById(id)?.quantity || 0,
    [getItemById]
  )

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity: updateQuantityFn,
    clearCart: clearCartFn,
    isInCart,
    getItemQuantity,
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems(),
    syncCartFromServer,
  }
}
