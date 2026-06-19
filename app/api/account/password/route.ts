import { NextRequest } from 'next/server'
import { requireAuth } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return apiError('Current password and new password are required', 400)
    }

    if (newPassword.length < 8) {
      return apiError('New password must be at least 8 characters', 400)
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return apiError('User not found', 404)
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return apiError('Current password is incorrect', 400)
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    })

    return Response.json({ message: 'Password updated successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
