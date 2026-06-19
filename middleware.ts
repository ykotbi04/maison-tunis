import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account')

  if (isAdminRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (req.auth.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  if (isAccountRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/account', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
