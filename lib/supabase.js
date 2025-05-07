import { createClient } from "@supabase/supabase-js"

// Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Singleton pattern for client-side Supabase client
let supabaseClient = null

// Create a Supabase client for client-side operations
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Determine the site URL based on environment
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "https://wfx247.com"

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      // Use the current site URL for redirects
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  return supabaseClient
}

// Get the admin client for server-side operations
export function getSupabaseAdmin() {
  return supabaseAdmin
}
