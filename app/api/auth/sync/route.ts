import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { cartSyncSchema, wishlistSyncSchema } from '@/lib/schemas/api'
import { syncGuestCart, getUserCart } from '@/lib/db/cart'
import { syncGuestWishlist, getUserWishlistProductIds } from '@/lib/db/wishlist'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    let cart = await getUserCart(session.user.id)
    let wishlist = await getUserWishlistProductIds(session.user.id)

    if (body.guestCart) {
      const guestCart = cartSyncSchema.shape.items.safeParse(body.guestCart)
      if (guestCart.success && guestCart.data.length > 0) {
        cart = await syncGuestCart(session.user.id, guestCart.data)
      }
    }

    if (body.guestWishlist) {
      const guestWishlist = wishlistSyncSchema.shape.productIds.safeParse(body.guestWishlist)
      if (guestWishlist.success && guestWishlist.data.length > 0) {
        wishlist = await syncGuestWishlist(session.user.id, guestWishlist.data)
      }
    }

    return Response.json({ cart, wishlist, user: { role: session.user.role } })
  } catch (error) {
    return handleApiError(error)
  }
}
