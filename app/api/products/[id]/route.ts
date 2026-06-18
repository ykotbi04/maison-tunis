import { NextRequest } from 'next/server'
import { apiError, handleApiError } from '@/lib/api-errors'
import { getProductById } from '@/lib/db/products'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
      return apiError('Product not found', 404)
    }

    return Response.json(product)
  } catch (error) {
    return handleApiError(error)
  }
}
