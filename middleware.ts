import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Middleware to protect /dashboard route
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    // getToken returns null if not authenticated
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || ''
    })
    if (!token) {
      // Redirect to sign-in page, preserve intended destination
      if (request.url && request.url.startsWith('http')) {
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(signInUrl)
      }
      // If request.url is not valid, allow the request (prevents build/prerender errors)
      return NextResponse.next()
    }
  }
  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
