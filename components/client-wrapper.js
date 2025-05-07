"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/contexts/AuthContext"

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <AuthProvider>{children}</AuthProvider>
}
