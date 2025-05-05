import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Mark the notification as read
    const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id).select()

    if (error) {
      console.error("Error marking notification as read:", error)
      return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
    }

    return NextResponse.json({ data: data[0], message: "Notification marked as read" })
  } catch (error) {
    console.error("Error in notifications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
