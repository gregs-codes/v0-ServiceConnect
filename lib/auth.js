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
