import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return errorResponse("Email is required", 400)
    }

    // Get the site URL from environment variable or use a default
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wfx247.com"

    // Send password reset email
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return errorResponse(error.message, 400)
    }

    // We don't want to reveal if the email exists in our system for security reasons
    return successResponse({
      message: "If your email is registered, you will receive a password reset link shortly.",
    })
  } catch (error) {
    console.error("Server error during password reset:", error)
    return errorResponse("Server error during password reset", 500)
  }
}
