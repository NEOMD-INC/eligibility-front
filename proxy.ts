import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const pathname = request.nextUrl.pathname

  const protectedPaths = [
    '/patient-dashboard',
    '/settings',
    '/user-management',
    '/user-profile',
    '/eligibility',
    '/logs',
  ]

  if (!token && protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/quick-link-dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    token &&
    (pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password'))
  ) {
    return NextResponse.redirect(new URL('/patient-dashboard', request.url))
  }

  // For all other requests, just continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/patient-dashboard/:path*',
    '/settings/:path*',
    '/user-management/:path*',
    '/user-profile/:path*',
    '/eligibility/:path*',
    '/logs/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}
