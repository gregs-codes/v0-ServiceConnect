import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function POST(request) {
  try {
    const { email, password, name, userType } = await request.json()

    if (!email || !password || !name || !userType) {
      return errorResponse("Missing required fields", 400)
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Registration error:", authError)
      return errorResponse(authError.message, 400)
    }

    const userId = authData.user.id

    // Create profile in profiles table
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: userId,
        full_name: name,
        user_type: userType,
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return errorResponse("Failed to create user profile", 500)
    }

    // Return success with user data
    return successResponse({
      user: {
        id: userId,
        email,
        profile: {
          id: userId,
          full_name: name,
          user_type: userType,
        },
      },
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Server error during registration:", error)
    return errorResponse("Server error during registration", 500)
  }
}
