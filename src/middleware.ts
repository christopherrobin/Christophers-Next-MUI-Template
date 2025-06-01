import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware to protect /dashboard and redirect /, /sign-in, /join to /dashboard if authenticated
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define routes where authenticated users should be redirected to /dashboard
  const authRedirectRoutes = ['/', '/sign-in', '/join']

  if (authRedirectRoutes.includes(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || ''
    })
    if (token) {
      // If authenticated, redirect to /dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // If not authenticated, allow to proceed
    return NextResponse.next()
  }

  // Only protect /dashboard
  const protectedPrefixes = ['/dashboard']
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    if (!token) {
      // Redirect to sign-in page, preserve intended destination
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }
  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sign-in', '/join', '/dashboard/:path*', '/dashboard']
}
