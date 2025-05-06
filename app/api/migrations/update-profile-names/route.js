import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all profiles that don't have a name but have a bio
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("id, bio")
      .is("name", null)
      .not("bio", "is", null)

    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching profiles: " + fetchError.message,
        },
        { status: 500 },
      )
    }

    let updatedCount = 0
    let errorCount = 0

    // Update each profile
    for (const profile of profiles) {
      // Extract a name from the bio if possible
      let name = "User"

      if (profile.bio) {
        // Try to extract a name from the beginning of the bio
        // This is a simple approach and might need refinement based on your bio format
        const bioWords = profile.bio.split(" ")
        if (bioWords.length >= 2) {
          // Assume first two words might be a name
          name = `${bioWords[0]} ${bioWords[1]}`
        } else if (bioWords.length === 1) {
          name = bioWords[0]
        }
      }

      // Update the profile with the extracted name
      const { error: updateError } = await supabaseAdmin.from("profiles").update({ name }).eq("id", profile.id)

      if (updateError) {
        console.error(`Error updating profile ${profile.id}:`, updateError)
        errorCount++
      } else {
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} profiles. Failed to update ${errorCount} profiles.`,
      totalProcessed: profiles.length,
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Migration error: " + error.message,
      },
      { status: 500 },
    )
  }
}
