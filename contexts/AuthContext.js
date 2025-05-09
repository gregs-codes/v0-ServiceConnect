"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "@/lib/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user:", e)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      const response = await loginUser({ email, password })

      // Check if there's an error with email verification
      if (
        !response.success &&
        response.message &&
        typeof response.message === "object" &&
        response.message.code === "EMAIL_NOT_VERIFIED"
      ) {
        setError(response.message)
        throw response
      }

      if (!response.success) {
        const errorMessage =
          typeof response.message === "string" ? response.message : "Login failed. Please check your credentials."
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      const userData = response.data

      if (!userData || !userData.user || !userData.token) {
        const errorMsg = "Invalid response from server"
        setError(errorMsg)
        throw new Error(errorMsg)
      }

      // Save user to state and localStorage
      setUser(userData.user)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.setItem("token", userData.token)

      return userData.user
    } catch (err) {
      console.error("Login error in context:", err)
      setError(err.message || "Login failed")
      throw err
    }
  }

  const register = async (userData) => {
    setError(null)
    try {
      const response = await registerUser(userData)

      if (!response.success) {
        const errorMessage =
          typeof response.message === "string" ? response.message : "Registration failed. Please try again."
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      return response.data
    } catch (err) {
      console.error("Registration error in context:", err)
      setError(err.message || "Registration failed")
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
