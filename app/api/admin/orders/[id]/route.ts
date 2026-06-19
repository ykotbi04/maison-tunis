import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import type { OrderStatus } from '@prisma/client'

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { id } = await params
    const body = await _request.json()
    const { status } = body

    if (!status || typeof status !== 'string') {
      return apiError('Status is required', 400)
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return apiError('Invalid status', 400)
    }

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return apiError('Order not found', 404)
    }

    const allowed = VALID_TRANSITIONS[order.status]
    if (!allowed || !allowed.includes(status)) {
      return apiError(
        `Cannot transition from ${order.status} to ${status}`,
        400
      )
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    return Response.json({
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
