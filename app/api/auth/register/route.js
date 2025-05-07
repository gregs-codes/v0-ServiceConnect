import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, accountType, serviceType } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Registration error:", authError)
      return NextResponse.json({ success: false, message: authError.message }, { status: 400 })
    }

    const userId = authData.user.id
    const fullName = `${firstName} ${lastName || ""}`.trim()
    const now = new Date().toISOString()

    // Step 1: Create a record in the public.users table
    const { error: userError } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName || "",
        created_at: now,
        updated_at: now,
        is_email_verified: false,
      },
    ])

    if (userError) {
      console.error("User creation error:", userError)
      // Try to delete the auth user if user creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, message: "Failed to create user record: " + userError.message },
        { status: 500 },
      )
    }

    // Step 2: Create profile in profiles table
    const profileData = {
      id: userId,
      user_id: userId, // Both id and user_id should reference the same user
      name: fullName,
      bio: `${fullName} is a new user.`,
      is_service_provider: accountType === "provider",
      availability_status: "available",
      average_rating: 0,
      total_reviews: 0,
      created_at: now,
      updated_at: now,
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert([profileData])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to delete the user records if profile creation fails
      await supabaseAdmin.from("users").delete().eq("id", userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, message: "Failed to create user profile: " + profileError.message },
        { status: 500 },
      )
    }

    // Return success with user data
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          profile: profileData,
        },
        message: "Registration successful",
      },
    })
  } catch (error) {
    console.error("Server error during registration:", error)
    return NextResponse.json(
      { success: false, message: "Server error during registration: " + error.message },
      { status: 500 },
    )
  }
}
