import { handleApiError } from '@/lib/api-errors'
import { getAllCategories } from '@/lib/db/categories'

export async function GET() {
  try {
    const categories = await getAllCategories()
    return Response.json(categories)
  } catch (error) {
    return handleApiError(error)
  }
}
