"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Processing authentication...")
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = getSupabaseClient()

      try {
        // Process the auth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setMessage("Authentication failed. Please try again.")
          // Redirect to login after a delay
          setTimeout(() => router.push("/login"), 2000)
          return
        }

        if (data?.session) {
          setMessage("Authentication successful! Redirecting...")
          // Redirect to dashboard or home page
          setTimeout(() => router.push("/dashboard"), 1000)
        } else {
          setMessage("No session found. Redirecting to login...")
          // Redirect to login after a delay
          setTimeout(() => router.push("/login"), 2000)
        }
      } catch (err) {
        console.error("Error in auth callback:", err)
        setMessage("An error occurred during authentication.")
        // Redirect to login after a delay
        setTimeout(() => router.push("/login"), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication</h1>
        <p>{message}</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
