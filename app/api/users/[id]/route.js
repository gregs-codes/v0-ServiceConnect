import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Get the user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(`
        id,
        user_id,
        bio,
        location,
        phone,
        is_service_provider,
        created_at,
        updated_at,
        users (
          id,
          email,
          first_name,
          last_name,
          avatar_url,
          is_email_verified
        )
      `)
      .eq("id", id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    if (!profileData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Format the user data
    const userData = {
      id: profileData.id,
      userId: profileData.user_id,
      firstName: profileData.users?.first_name,
      lastName: profileData.users?.last_name,
      email: profileData.users?.email,
      avatar: profileData.users?.avatar_url,
      isEmailVerified: profileData.users?.is_email_verified,
      bio: profileData.bio,
      location: profileData.location,
      phone: profileData.phone,
      isServiceProvider: profileData.is_service_provider,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at,
    }

    return NextResponse.json({ data: userData })
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Get the user profile to check if it exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("id", id)
      .single()

    if (profileError || !existingProfile) {
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Update the user data in the users table
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
      })
      .eq("id", existingProfile.user_id)

    if (userUpdateError) {
      console.error("Error updating user:", userUpdateError)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    // Update the profile data
    const { data: updatedProfile, error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        bio: body.bio,
        location: body.location,
        phone: body.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (profileUpdateError) {
      console.error("Error updating profile:", profileUpdateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ data: updatedProfile[0], message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
