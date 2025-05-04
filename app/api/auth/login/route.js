import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../../utils/apiResponse"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

/**
 * POST method to login a user
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(errorResponse("Email and password are required", 400), { status: 400 })
    }

    // Get user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, password_hash, first_name, last_name")
      .eq("email", body.email)
      .single()

    if (userError || !user) {
      return NextResponse.json(errorResponse("Invalid email or password", 401), { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json(errorResponse("Invalid email or password", 401), { status: 401 })
    }

    // Get profile info
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("is_service_provider")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      // Continue anyway, we'll assume they're not a provider
    }

    const isProvider = profile?.is_service_provider || false

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      isProvider: isProvider,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    // Return user data and token
    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isProvider: isProvider,
          },
          token,
        },
        "Login successful",
      ),
    )
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json(errorResponse("Failed to login", 500), { status: 500 })
  }
}
