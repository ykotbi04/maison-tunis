import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { clearUserCart, getUserCart } from '@/lib/db/cart'

export async function GET() {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const cart = await getUserCart(session.user.id)
    return Response.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE() {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const cart = await clearUserCart(session.user.id)
    return Response.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}
