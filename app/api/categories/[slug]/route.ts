import { NextRequest } from 'next/server'
import { apiError, handleApiError } from '@/lib/api-errors'
import { getCategoryBySlug } from '@/lib/db/categories'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
      return apiError('Category not found', 404)
    }

    return Response.json(category)
  } catch (error) {
    return handleApiError(error)
  }
}
