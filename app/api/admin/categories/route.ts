import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })

    return Response.json(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        productCount: cat._count.products,
        createdAt: cat.createdAt.toISOString(),
      }))
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const body = await request.json()
    const { name, slug, description, image } = body

    if (!name || !slug) {
      return apiError('Name and slug are required', 400)
    }

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return apiError('A category with this slug already exists', 409)
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        image: image || '/images/placeholder.jpg',
      },
    })

    return Response.json(category, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
