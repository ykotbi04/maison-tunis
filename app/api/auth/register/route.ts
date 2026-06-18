import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { apiError, handleApiError } from '@/lib/api-errors'
import { registerSchema } from '@/lib/schemas/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return apiError('Email already registered', 409)
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return Response.json({ user }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
