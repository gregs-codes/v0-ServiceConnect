import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return errorResponse("Email is required", 400)
    }

    // Determine the site URL based on the request
    const siteUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://wfx247.com"

    // Send email verification with the correct redirect URL
    const { data, error } = await supabaseAdmin.auth.resend({
      type: "signup",
      email: email,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error resending verification email:", error)
      return errorResponse(error.message, 400)
    }

    return successResponse({
      message: "Verification email sent successfully. Please check your inbox.",
    })
  } catch (error) {
    console.error("Server error during verification email resend:", error)
    return errorResponse("Server error during verification email resend", 500)
  }
}
