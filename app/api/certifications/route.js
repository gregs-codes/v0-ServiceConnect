import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Get the user's profile ID first
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (profileError || !profileData) {
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get certifications for the profile
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("profile_id", profileData.id)
      .order("issue_date", { ascending: false })

    if (error) {
      console.error("Error fetching certifications:", error)
      return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in certifications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
