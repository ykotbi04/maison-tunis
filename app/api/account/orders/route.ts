import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))

    const where = { userId: session.user.id }
    const skip = (page - 1) * limit

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return Response.json({
      data: orders.map((order) => ({
        id: order.id,
        shortId: order.id.slice(-6).toUpperCase(),
        items: order.items.map((item) => ({
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          price: Number(item.priceSnapshot),
          size: item.size,
          color: item.color,
        })),
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
