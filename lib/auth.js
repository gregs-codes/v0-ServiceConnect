import { jwtVerify, SignJWT } from "jose"
import { supabaseAdmin } from "./supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRY = "7d" // Token expires in 7 days

/**
 * Generate a JWT token for a user
 */
export async function generateJWT(userId) {
  const payload = { userId }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

/**
 * Verify a JWT token and return the payload
 */
export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

/**
 * Get the current user from a request
 */
export async function getCurrentUser(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) return null

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) return null

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, first_name, last_name, avatar_url")
      .eq("id", payload.userId)
      .single()

    if (error || !user) return null

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
