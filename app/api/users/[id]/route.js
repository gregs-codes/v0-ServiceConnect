import { createClient } from "@/lib/supabase"
import { apiResponse } from "@/app/api/utils/apiResponse"
import { verifyAuth } from "@/lib/auth"

// GET user profile
export async function GET(request, { params }) {
  try {
    const { id } = params
    const supabase = createClient()

    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return apiResponse({
        status: 401,
        message: "Unauthorized",
      })
    }

    // Only allow users to access their own profile
    if (authResult.userId !== id) {
      return apiResponse({
        status: 403,
        message: "Forbidden: You can only access your own profile",
      })
    }

    // Get user profile from profiles table
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return apiResponse({
        status: 500,
        message: "Error fetching user profile",
        error: error.message,
      })
    }

    if (!data) {
      return apiResponse({
        status: 404,
        message: "User profile not found",
      })
    }

    return apiResponse({
      status: 200,
      data,
    })
  } catch (error) {
    console.error("Error in GET user profile:", error)
    return apiResponse({
      status: 500,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// PUT update user profile
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const supabase = createClient()

    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return apiResponse({
        status: 401,
        message: "Unauthorized",
      })
    }

    // Only allow users to update their own profile
    if (authResult.userId !== id) {
      return apiResponse({
        status: 403,
        message: "Forbidden: You can only update your own profile",
      })
    }

    // Update user profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        bio: body.bio,
        location: body.location,
        is_service_provider: body.is_service_provider,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user profile:", error)
      return apiResponse({
        status: 500,
        message: "Error updating user profile",
        error: error.message,
      })
    }

    return apiResponse({
      status: 200,
      message: "Profile updated successfully",
      data,
    })
  } catch (error) {
    console.error("Error in PUT user profile:", error)
    return apiResponse({
      status: 500,
      message: "Internal server error",
      error: error.message,
    })
  }
}
