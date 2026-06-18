import { NextRequest } from 'next/server'
import type { Gender } from '@prisma/client'
import { handleApiError } from '@/lib/api-errors'
import { productSearchQuerySchema } from '@/lib/schemas/api'
import { getAllProducts } from '@/lib/db/products'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = productSearchQuerySchema.parse({
      query: searchParams.get('query') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      gender: searchParams.get('gender') ?? undefined,
      priceMin: searchParams.get('priceMin') ?? undefined,
      priceMax: searchParams.get('priceMax') ?? undefined,
      inStockOnly: searchParams.get('inStockOnly') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    const result = await getAllProducts({
      search: parsed.query,
      categorySlug: parsed.category,
      gender: parsed.gender as Gender | undefined,
      priceMin: parsed.priceMin,
      priceMax: parsed.priceMax,
      inStockOnly: parsed.inStockOnly,
      page: parsed.page,
      limit: parsed.limit,
    })

    return Response.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
