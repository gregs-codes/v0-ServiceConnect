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

    // Create profile in profiles table
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: userId,
        full_name: fullName,
        user_type: accountType,
        service_type: serviceType || null,
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to delete the auth user if profile creation fails
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
          profile: {
            id: userId,
            full_name: fullName,
            user_type: accountType,
            service_type: serviceType || null,
          },
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
