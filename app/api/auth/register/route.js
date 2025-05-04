import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../../utils/apiResponse"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

/**
 * POST method to register a new user
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.email || !body.password || !body.firstName) {
      return NextResponse.json(errorResponse("Email, password, and first name are required", 400), { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", body.email)

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json(errorResponse("Failed to check for existing user", 500), { status: 500 })
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(errorResponse("User with this email already exists", 409), { status: 409 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)

    // Create the user
    const { data: newUser, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        email: body.email,
        password_hash: hashedPassword,
        first_name: body.firstName,
        last_name: body.lastName || "",
        avatar_url: body.avatar || null,
        is_email_verified: false,
      })
      .select("id, email, first_name, last_name, created_at")
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      return NextResponse.json(errorResponse("Failed to create user account", 500), { status: 500 })
    }

    // Create the profile
    const isProvider = body.accountType === "provider"
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: newUser.id,
      is_service_provider: isProvider,
      location: body.location || null,
      hourly_rate: isProvider ? body.hourlyRate || 0 : null,
      bio: body.bio || null,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // Continue anyway, we've created the main user
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const token = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      isProvider: isProvider,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    // Return the user data and token
    return NextResponse.json(
      successResponse(
        {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            createdAt: newUser.created_at,
            isProvider: isProvider,
          },
          token,
        },
        "User registered successfully",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(errorResponse("Failed to register user", 500), { status: 500 })
  }
}
