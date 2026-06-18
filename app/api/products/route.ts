import { NextRequest } from 'next/server'
import type { Gender } from '@prisma/client'
import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { productCreateSchema } from '@/lib/schemas/api'
import { createProduct, getAllProducts } from '@/lib/db/products'
import { getCategoryIdBySlug } from '@/lib/db/categories'

function parseGender(value: string | null): Gender | undefined {
  if (!value) return undefined
  const upper = value.toUpperCase()
  if (upper === 'MEN' || upper === 'WOMEN' || upper === 'UNISEX') {
    return upper
  }
  return undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') ?? undefined
    const gender = parseGender(searchParams.get('gender'))

    const result = await getAllProducts({
      categorySlug: category,
      gender,
    })

    return Response.json(result)
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
    const data = productCreateSchema.parse(body)
    const categoryId = await getCategoryIdBySlug(data.categorySlug)

    if (!categoryId) {
      return apiError('Category not found', 404)
    }

    const product = await createProduct({
      id: data.id,
      name: data.name,
      categoryId,
      gender: data.gender,
      price: data.price,
      description: data.description,
      longDescription: data.longDescription,
      image: data.image,
      images: data.images,
      color: data.color,
      colors: data.colors,
      size: data.size,
      sizes: data.sizes,
      material: data.material,
      care: data.care,
      inStock: data.inStock,
      stock: data.stock,
      isNew: data.isNew,
      isLimited: data.isLimited,
      limitedQty: data.limitedQty,
      rating: data.rating,
      reviews: data.reviews,
      sku: data.sku,
      heritage: data.heritage,
    })

    return Response.json(product, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
