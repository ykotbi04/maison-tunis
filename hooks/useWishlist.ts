import { useCallback, useEffect, useState } from 'react'
import {
  useWishlistItems,
  useAddWishlistItem,
  useRemoveWishlistItem,
  useHasWishlistItem,
  useClearWishlist,
  useWishlistStore,
} from '@/lib/stores'
import { useAuthSession } from '@/hooks/useAuthSession'

async function fetchWishlist(): Promise<string[]> {
  const response = await fetch('/api/wishlist')
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist')
  }
  return response.json()
}

async function syncWishlistApi(productIds: string[]): Promise<string[]> {
  const response = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds }),
  })
  if (!response.ok) {
    throw new Error('Failed to sync wishlist')
  }
  return response.json()
}

export function useWishlist() {
  const items = useWishlistItems()
  const addItem = useAddWishlistItem()
  const removeItem = useRemoveWishlistItem()
  const hasItem = useHasWishlistItem()
  const clearWishlist = useClearWishlist()
  const { isAuthenticated } = useAuthSession()
  const [, setSynced] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    void (async () => {
      try {
        const productIds = await fetchWishlist()
        useWishlistStore.setState({
          items: productIds.map((productId) => ({
            productId,
            addedAt: new Date(),
          })),
        })
        setSynced(true)
      } catch {
        // Keep local wishlist
      }
    })()
  }, [isAuthenticated])

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        try {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
        } catch {
          // Fall back to local
        }
      }

      addItem(productId)
    },
    [addItem, isAuthenticated]
  )

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        try {
          await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
        } catch {
          // Fall back to local
        }
      }

      removeItem(productId)
    },
    [isAuthenticated, removeItem]
  )

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (hasItem(productId)) {
        await removeFromWishlist(productId)
      } else {
        await addToWishlist(productId)
      }
    },
    [addToWishlist, hasItem, removeFromWishlist]
  )

  const isInWishlist = useCallback(
    (productId: string) => hasItem(productId),
    [hasItem]
  )

  const clearWishlistFn = useCallback(() => {
    clearWishlist()
  }, [clearWishlist])

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist: clearWishlistFn,
    itemCount: items.length,
    syncWishlistApi,
  }
}
