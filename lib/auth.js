import { jwtVerify } from "jose"

export async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("JWT Verification Error:", error)
    return null
  }
}

// Add the missing verifyAuth export
export async function verifyAuth(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authenticated: false, error: "Missing or invalid authorization header" }
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    if (!token) {
      return { authenticated: false, error: "No token provided" }
    }

    // Verify the token
    const payload = await verifyJWT(token)

    if (!payload) {
      return { authenticated: false, error: "Invalid token" }
    }

    // Return the authenticated user data
    return {
      authenticated: true,
      user: payload,
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return { authenticated: false, error: error.message }
  }
}
