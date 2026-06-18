import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { apiError, handleApiError } from '@/lib/api-errors'
import { loginSchema, cartSyncSchema, wishlistSyncSchema } from '@/lib/schemas/api'
import { syncGuestCart, getUserCart } from '@/lib/db/cart'
import { syncGuestWishlist, getUserWishlistProductIds } from '@/lib/db/wishlist'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const credentials = loginSchema.parse({
      email: body.email,
      password: body.password,
    })

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    })

    if (!user) {
      return apiError('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(credentials.password, user.passwordHash)
    if (!valid) {
      return apiError('Invalid email or password', 401)
    }

    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })

    if (result?.error) {
      return apiError('Invalid email or password', 401)
    }

    let cart = await getUserCart(user.id)
    let wishlist = await getUserWishlistProductIds(user.id)

    if (body.guestCart) {
      const guestCart = cartSyncSchema.shape.items.safeParse(body.guestCart)
      if (guestCart.success && guestCart.data.length > 0) {
        cart = await syncGuestCart(user.id, guestCart.data)
      }
    }

    if (body.guestWishlist) {
      const guestWishlist = wishlistSyncSchema.shape.productIds.safeParse(body.guestWishlist)
      if (guestWishlist.success && guestWishlist.data.length > 0) {
        wishlist = await syncGuestWishlist(user.id, guestWishlist.data)
      }
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      cart,
      wishlist,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
