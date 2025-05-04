import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../../utils/apiResponse"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

/**
 * POST method to authenticate a user
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(errorResponse("Email and password are required", 400), { status: 400 })
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select(`
        id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        avatar_url,
        profiles (is_service_provider)
      `)
      .eq("email", body.email)
      .single()

    if (userError) {
      if (userError.code === "PGRST116") {
        return NextResponse.json(errorResponse("Invalid email or password", 401), { status: 401 })
      }
      console.error("Database error:", userError)
      return NextResponse.json(errorResponse("Failed to authenticate", 500), { status: 500 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json(errorResponse("Invalid email or password", 401), { status: 401 })
    }

    // Update last login time
    await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Generate JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      isProvider: user.profiles?.is_service_provider || false,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    // Return user info and token
    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: user.avatar_url,
            isProvider: user.profiles?.is_service_provider || false,
          },
          token,
        },
        "Login successful",
      ),
      { status: 200 },
    )
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json(errorResponse("Failed to login", 500), { status: 500 })
  }
}
