import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Paths that don't require authentication
const publicPaths = ["/api/auth/login", "/api/auth/register", "/api/services", "/api/providers"]

export async function middleware(request) {
  // Check if the path requires authentication
  const path = request.nextUrl.pathname

  // Allow all methods for auth endpoints
  if (path.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Allow GET requests for public paths
  if (publicPaths.some((publicPath) => path.startsWith(publicPath)) && request.method === "GET") {
    return NextResponse.next()
  }

  // Get the token from the Authorization header
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Authentication required", statusCode: 401 }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  try {
    // Verify the token using jose instead of jsonwebtoken
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)

    // Add user info to the request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.userId)
    requestHeaders.set("x-user-email", payload.email)
    requestHeaders.set("x-user-is-provider", String(payload.isProvider))

    // Continue with the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid or expired token", statusCode: 401 }, { status: 401 })
  }
}

// Configure which paths the middleware applies to
export const config = {
  matcher: ["/api/:path*"],
}
