import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function apiError(
  message: string,
  status: number,
  details: Record<string, unknown> = {}
) {
  return NextResponse.json(
    { error: message, message, details },
    { status }
  )
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError('Validation failed', 400, {
      issues: error.issues,
    })
  }

  if (error instanceof Error) {
    if (error.message === 'Product unavailable') {
      return apiError(error.message, 400)
    }
    if (error.message === 'Cart item not found') {
      return apiError(error.message, 404)
    }
    if (error.message.startsWith('Product unavailable:')) {
      return apiError(error.message, 400)
    }

    if (process.env.NODE_ENV !== 'production') console.error(error)
    return apiError('Internal server error', 500)
  }

  return apiError('Internal server error', 500)
}
