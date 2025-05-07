import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase login error:", error)

      // Handle specific error codes
      if (error.code === "invalid_credentials") {
        return errorResponse("The email or password you entered is incorrect", 401)
      }

      // Check if the error is due to email not being confirmed
      if (error.message.includes("Email not confirmed")) {
        // Get user by email to check if they exist
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers({
          filter: {
            email: email,
          },
        })

        const user = userData?.users?.[0]

        if (user) {
          // Return a specific error for unverified email with the user ID
          return errorResponse(
            {
              message: "Your email has not been verified. Please check your inbox or request a new verification email.",
              code: "EMAIL_NOT_VERIFIED",
              userId: user.id,
            },
            401,
          )
        }
      }

      // Handle other common errors
      if (error.message.includes("rate limit")) {
        return errorResponse("Too many login attempts. Please try again later.", 429)
      }

      // Default error message
      return errorResponse(error.message || "Authentication failed", 401)
    }

    if (!data || !data.user || !data.session) {
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
    return errorResponse("Server error during login", 500)
  }
}
