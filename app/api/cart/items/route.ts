import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { addCartItem } from '@/lib/db/cart'
import { cartItemSchema } from '@/lib/schemas/api'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const item = cartItemSchema.parse(body)
    const cart = await addCartItem(session.user.id, item)
    return Response.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}
