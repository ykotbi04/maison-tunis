import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const { name, email } = body

    if (!name && !email) {
      return apiError('At least one field (name or email) is required', 400)
    }

    if (email && email !== session.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return apiError('Email already in use', 409)
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return Response.json(updated)
  } catch (error) {
    return handleApiError(error)
  }
}
