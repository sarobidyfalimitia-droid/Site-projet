import { NextRequest, NextResponse } from 'next/server'

// Protected admin routes
const ADMIN_ROUTES = ['/admin']
// Protected client routes  
const CLIENT_ROUTES = ['/client']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  const isClientRoute = CLIENT_ROUTES.some(r => pathname.startsWith(r))

  if (!isAdminRoute && !isClientRoute) return NextResponse.next()

  // Get access token from cookie
  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Note: Full JWT verification is done on the client & API side
  // Middleware only checks token presence for fast redirect
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
}