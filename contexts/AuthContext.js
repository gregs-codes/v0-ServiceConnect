"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "@/lib/api"

// Create the context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for saved token on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedToken = localStorage.getItem("authToken")
        const savedUser = localStorage.getItem("user")

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch (err) {
        console.error("Error restoring auth state:", err)
        // Clear potentially corrupted auth data
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await loginUser({ email, password })

      // Save token and user data
      const { token, user } = response.data

      // Only store in localStorage on client side
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token)
        localStorage.setItem("user", JSON.stringify(user))
      }

      setToken(token)
      setUser(user)
      return user
    } catch (err) {
      setError(err.message || "Failed to login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await registerUser(userData)

      // If registration returns a token, log the user in automatically
      if (response.data.token) {
        const { token, user } = response.data

        // Only store in localStorage on client side
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token)
          localStorage.setItem("user", JSON.stringify(user))
        }

        setToken(token)
        setUser(user)
      }

      return response.data
    } catch (err) {
      setError(err.message || "Failed to register")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    }
    setToken(null)
    setUser(null)
  }

  // Check if user is authenticated
  const isAuthenticated = !!token

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
