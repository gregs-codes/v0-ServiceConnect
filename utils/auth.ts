import { createServerClient } from "./supabase/server"

export async function getCurrentUser() {
  const supabase = createServerClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  return session.user
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error || !profile) {
    return null
  }

  return profile
}
