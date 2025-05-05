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
      const userData = response.data

      // Save user to state and localStorage
      setUser(userData.user)
      localStorage.setItem("user", JSON.stringify(userData.user))
      localStorage.setItem("token", userData.token)

      return userData.user
    } catch (err) {
      setError(err.message || "Login failed")
      throw err
    }
  }

  const register = async (userData) => {
    setError(null)
    try {
      const response = await registerUser(userData)
      return response.data
    } catch (err) {
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
