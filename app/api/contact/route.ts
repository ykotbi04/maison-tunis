import { NextRequest } from 'next/server'
import { handleApiError } from '@/lib/api-errors'
import { contactSchema } from '@/lib/schemas/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    console.log('Contact form submission:', data)

    return Response.json({ success: true, message: 'Message received. We will get back to you shortly.' })
  } catch (error) {
    return handleApiError(error)
  }
}
