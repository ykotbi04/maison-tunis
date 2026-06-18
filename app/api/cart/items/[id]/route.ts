import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { removeCartItem, updateCartItemQuantity } from '@/lib/db/cart'
import { cartItemUpdateSchema } from '@/lib/schemas/api'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { id } = await params
    const body = await request.json()
    const { quantity } = cartItemUpdateSchema.parse(body)
    const cart = await updateCartItemQuantity(session.user.id, id, quantity)
    return Response.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { id } = await params
    const cart = await removeCartItem(session.user.id, id)
    return Response.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}
