"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, authChecked } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after auth has been checked and if user is not authenticated
    if (authChecked && !loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, authChecked, router])

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  // If authenticated, render the children
  return isAuthenticated ? children : null
}
