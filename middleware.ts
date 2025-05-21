import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path.startsWith("/_next") || path.startsWith("/favicon.ico")

  // Check if user is logged in
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
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
