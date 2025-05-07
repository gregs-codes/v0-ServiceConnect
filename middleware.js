import { NextResponse } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/projects/create", "/messages"]

// Define routes that should be accessible only to non-authenticated users
const authRoutes = ["/login", "/signup"]

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // Get the authentication token from the request cookies
  const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1]

  // For debugging
  console.log(`Path: ${pathname}, Protected: ${isProtectedRoute}, Auth Route: ${isAuthRoute}, Has Token: ${!!token}`)

  // If the route is protected and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    console.log("Redirecting to login from protected route")
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // If the route is for non-authenticated users and there's a token, redirect to dashboard
  if (isAuthRoute && token) {
    console.log("Redirecting to dashboard from auth route")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
