import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    console.log("Login attempt for email:", email)

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase login error:", error)
      return errorResponse(error.message || "Authentication failed", 401)
    }

    if (!data || !data.user || !data.session) {
      console.error("Supabase returned unexpected data structure:", data)
      return errorResponse("Invalid response from authentication service", 500)
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      // Continue anyway, just log the error
    }

    // Return user data and session
    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
        profile: profile || null,
      },
      token: data.session.access_token,
    })
  } catch (error) {
    console.error("Server error during login:", error)
    return errorResponse("Server error during login: " + (error.message || "Unknown error"), 500)
  }
}
