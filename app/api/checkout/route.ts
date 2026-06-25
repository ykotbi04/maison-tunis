import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { checkoutSchema } from '@/lib/schemas/api'
import { createOrderFromCheckout } from '@/lib/db/orders'
import { getUserCart } from '@/lib/db/cart'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const data = checkoutSchema.parse(body)

    const items = data.items ?? (await getUserCart(session.user.id))
    if (items.length === 0) {
      return apiError('Cart is empty', 400)
    }

    const order = await createOrderFromCheckout(session.user.id, {
      shipping: data.shipping,
      payment: {
        method: data.payment.method,
        cardNumber: data.payment.cardNumber ?? '',
        cardExpiry: data.payment.cardExpiry ?? '',
        cardCvc: data.payment.cardCvc ?? '',
      },
      items,
    })

    return Response.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Product unavailable')) {
      return apiError(error.message, 400)
    }
    return handleApiError(error)
  }
}