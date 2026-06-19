import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import { mapProducts } from '@/lib/mappers/product'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const gender = searchParams.get('gender') || undefined
    const inStock = searchParams.get('inStock') || undefined

    const where: Prisma.ProductWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (gender && (gender === 'MEN' || gender === 'WOMEN' || gender === 'UNISEX')) {
      where.gender = gender
    }

    if (inStock !== null && inStock !== undefined) {
      where.inStock = inStock === 'true'
    }

    const skip = (page - 1) * limit

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    return Response.json({
      data: mapProducts(products),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
