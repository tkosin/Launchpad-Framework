import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Get the path of the request
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath =
      path === "/login" || path.startsWith("/_next") || path.startsWith("/favicon.ico") || path.includes(".") // Skip files with extensions

    // Check if user is logged in - safely access cookies
    const isLoggedIn = request.cookies.has("user")

    // Redirect logic
    if (!isPublicPath && !isLoggedIn) {
      // Redirect to login if trying to access protected route without being logged in
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isPublicPath && isLoggedIn && path === "/login") {
      // Redirect to dashboard if already logged in and trying to access login page
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to proceed
    return NextResponse.next()
  }
}

// Configure the middleware to run on specific paths, but exclude static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - files with extensions (.js, .css, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}
