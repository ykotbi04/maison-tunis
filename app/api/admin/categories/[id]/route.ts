import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'

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

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return apiError('Category not found', 404)
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugTaken = await prisma.category.findUnique({ where: { slug: body.slug } })
      if (slugTaken) {
        return apiError('A category with this slug already exists', 409)
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
      },
    })

    return Response.json(category)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const { id } = await params

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    })
    if (!existing) {
      return apiError('Category not found', 404)
    }

    if (existing._count.products > 0) {
      return apiError(
        `Cannot delete category with ${existing._count.products} product(s). Remove or reassign products first.`,
        400
      )
    }

    await prisma.category.delete({ where: { id } })

    return Response.json({ message: 'Category deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}
