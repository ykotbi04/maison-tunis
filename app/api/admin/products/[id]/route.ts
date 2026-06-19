import { NextRequest } from 'next/server'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { prisma } from '@/lib/prisma'
import { mapProduct } from '@/lib/mappers/product'
import type { Prisma } from '@prisma/client'

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

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return apiError('Product not found', 404)
    }

    const data: Prisma.ProductUpdateInput = {}

    if (body.name !== undefined) data.name = body.name
    if (body.gender !== undefined) data.gender = body.gender
    if (body.price !== undefined) data.price = body.price
    if (body.description !== undefined) data.description = body.description
    if (body.longDescription !== undefined) data.longDescription = body.longDescription
    if (body.image !== undefined) data.image = body.image
    if (body.images !== undefined) data.images = body.images
    if (body.color !== undefined) data.color = body.color
    if (body.colors !== undefined) data.colors = body.colors
    if (body.size !== undefined) data.size = body.size
    if (body.sizes !== undefined) data.sizes = body.sizes
    if (body.material !== undefined) data.material = body.material
    if (body.care !== undefined) data.care = body.care
    if (body.inStock !== undefined) data.inStock = body.inStock
    if (body.stock !== undefined) data.stock = body.stock
    if (body.isNew !== undefined) data.isNew = body.isNew
    if (body.isLimited !== undefined) data.isLimited = body.isLimited
    if (body.limitedQty !== undefined) data.limitedQty = body.limitedQty
    if (body.rating !== undefined) data.rating = body.rating
    if (body.reviews !== undefined) data.reviews = body.reviews
    if (body.sku !== undefined) data.sku = body.sku
    if (body.heritage !== undefined) data.heritage = body.heritage

    if (body.categorySlug !== undefined) {
      const category = await prisma.category.findUnique({
        where: { slug: body.categorySlug },
      })
      if (!category) {
        return apiError('Category not found', 404)
      }
      data.category = { connect: { id: category.id } }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    })

    return Response.json(mapProduct(product))
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

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return apiError('Product not found', 404)
    }

    await prisma.product.delete({ where: { id } })

    return Response.json({ message: 'Product deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}
