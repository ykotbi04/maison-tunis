import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('authjs.session-token')?.value
    ?? req.cookies.get('__Secure-authjs.session-token')?.value

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account')

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next()
  }

  if (!sessionCookie) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.redirect(new URL('/login?callbackUrl=/account', req.url))
  }

  try {
    const baseUrl = req.nextUrl.origin
    const sessionRes = await fetch(`${baseUrl}/api/auth/session`, {
      headers: { cookie: `authjs.session-token=${sessionCookie}` },
    })
    const session = await sessionRes.json()

    if (!session?.user) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      return NextResponse.redirect(new URL('/login?callbackUrl=/account', req.url))
    }

    if (isAdminRoute && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.redirect(new URL('/login?callbackUrl=/account', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
