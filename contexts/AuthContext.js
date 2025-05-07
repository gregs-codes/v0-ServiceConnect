"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "@/lib/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Load user from localStorage on initial render and window focus
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (savedUser && token) {
          setUser(JSON.parse(savedUser))
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error("Failed to parse saved user:", e)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setLoading(false)
        setAuthChecked(true)
      }
    }

    // Load on initial mount
    loadUser()

    // Also load when window gets focus, in case localStorage changed in another tab
    window.addEventListener("focus", loadUser)

    return () => {
      window.removeEventListener("focus", loadUser)
    }
  }, [])

  // Periodically check token expiration
  useEffect(() => {
    if (!user) return

    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem("token")
      if (!token) {
        logout()
        return
      }

      // Check if token is expired (if it's a JWT)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const expiry = payload.exp * 1000 // Convert to milliseconds

        if (Date.now() > expiry) {
          console.log("Token expired, logging out")
          logout()
        }
      } catch (e) {
        // If token isn't a valid JWT or doesn't have exp, just continue
        console.error("Error checking token expiration:", e)
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkTokenInterval)
  }, [user])

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
    authChecked,
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
