import { createClient } from "@supabase/supabase-js"

// Re-export createClient
export { createClient }

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a Supabase client for client-side usage
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Create a Supabase admin client for server-side usage
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Create a singleton instance for client-side usage
let clientInstance = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    // Server-side: create a new instance each time
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Client-side: reuse the instance
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return clientInstance
}
