import { requireAdmin } from '@/auth'
import { apiError, handleApiError } from '@/lib/api-errors'
import { getAdminDashboard } from '@/lib/db/admin'

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }

    const dashboard = await getAdminDashboard()
    return Response.json(dashboard)
  } catch (error) {
    return handleApiError(error)
  }
}
