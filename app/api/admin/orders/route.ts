import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import type { Prisma, OrderStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const where: Prisma.OrderWhereInput = {}

    if (status && ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      where.status = status as OrderStatus
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
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
        customer: { id: order.user.id, name: order.user.name, email: order.user.email },
        items: order.items.map((item) => ({
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          price: Number(item.priceSnapshot),
          size: item.size,
          color: item.color,
        })),
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        tax: Number(order.tax),
        total: Number(order.total),
        status: order.status,
        shipping: {
          firstName: order.shippingFirstName,
          lastName: order.shippingLastName,
          email: order.shippingEmail,
          phone: order.shippingPhone,
          address: order.shippingAddress,
          city: order.shippingCity,
          state: order.shippingState,
          postalCode: order.shippingPostalCode,
          country: order.shippingCountry,
        },
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
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
