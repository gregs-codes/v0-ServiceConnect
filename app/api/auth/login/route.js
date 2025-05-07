import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

// Helper functions for consistent responses
function successResponse(data) {
  return NextResponse.json({ success: true, data }, { status: 200 })
}

function errorResponse(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export async function POST(request) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return errorResponse("Invalid request body", 400)
    }

    const { email, password } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    console.log(`Attempting login for email: ${email}`)

    try {
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
                message:
                  "Your email has not been verified. Please check your inbox or request a new verification email.",
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
    } catch (supabaseError) {
      console.error("Supabase operation error:", supabaseError)
      return errorResponse("Authentication service error", 500)
    }
  } catch (error) {
    console.error("Server error during login:", error)
    return errorResponse("Server error during login", 500)
  }
}
