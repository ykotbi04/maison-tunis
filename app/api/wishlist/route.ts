import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { wishlistSyncSchema, wishlistItemSchema } from '@/lib/schemas/api'
import {
  addWishlistItem,
  getUserWishlistProductIds,
  removeWishlistItem,
  syncGuestWishlist,
} from '@/lib/db/wishlist'

export async function GET() {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const wishlist = await getUserWishlistProductIds(session.user.id)
    return Response.json(wishlist)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()

    if (body.productIds) {
      const productIds = wishlistSyncSchema.shape.productIds.parse(body.productIds)
      const wishlist = await syncGuestWishlist(session.user.id, productIds)
      return Response.json(wishlist)
    }

    if (body.productId) {
      const { productId } = wishlistItemSchema.parse(body)
      const wishlist = await addWishlistItem(session.user.id, productId)
      return Response.json(wishlist)
    }

    return apiError('productId or productIds required', 400)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const { productId } = wishlistItemSchema.parse(body)
    const wishlist = await removeWishlistItem(session.user.id, productId)
    return Response.json(wishlist)
  } catch (error) {
    return handleApiError(error)
  }
}
