import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { getOrderById } from '@/lib/db/orders'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { id } = await params
    const order = await getOrderById(
      id,
      session.user.role === 'ADMIN' ? undefined : session.user.id
    )

    if (!order) {
      return apiError('Order not found', 404)
    }

    return Response.json(order)
  } catch (error) {
    return handleApiError(error)
  }
}
