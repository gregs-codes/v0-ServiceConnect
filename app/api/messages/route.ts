import { createServerClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/utils/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const userId = searchParams.get("userId")

  const supabase = createServerClient()

  let query = supabase
    .from("messages")
    .select(`
    *,
    sender:sender_id(
      id,
      first_name,
      last_name,
      avatar_url
    ),
    recipient:recipient_id(
      id,
      first_name,
      last_name,
      avatar_url
    )
  `)
    .order("created_at", { ascending: false })

  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  if (userId) {
    query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServerClient()
  const data = await request.json()

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      ...data,
      sender_id: user.id,
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(message)
}
