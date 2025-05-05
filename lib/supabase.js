import { createClient } from "@supabase/supabase-js"

// Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

// Singleton pattern for client-side Supabase client
let supabaseClient = null

// Create a Supabase client for client-side operations
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

  return supabaseClient
}

// Get the admin client for server-side operations
export function getSupabaseAdmin() {
  return supabaseAdmin
}
