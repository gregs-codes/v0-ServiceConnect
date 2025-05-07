"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle, XCircle, Info, WifiOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const router = useRouter()
  const { login, error: authError } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [apiError, setApiError] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const testApiConnection = async () => {
    try {
      const response = await fetch("/api/test")
      if (response.ok) {
        setApiError(false)
        return true
      } else {
        setApiError(true)
        return false
      }
    } catch (error) {
      console.error("API connection test failed:", error)
      setApiError(true)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setShowVerificationMessage(false)
    setEmailVerificationSent(false)
    setApiError(false)

    // Test API connection first
    const apiWorking = await testApiConnection()
    if (!apiWorking) {
      setError("Unable to connect to the server. Please check your internet connection and try again.")
      setIsSubmitting(false)
      return
    }

    try {
      await login(formData.email, formData.password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setAttempts((prev) => prev + 1)

      if (error.message && error.message.includes("Unexpected end of input")) {
        setError("Server communication error. Please try again later.")
        setApiError(true)
      } else if (error.message && typeof error.message === "object" && error.message.code === "EMAIL_NOT_VERIFIED") {
        setShowVerificationMessage(true)
      } else {
        setError(error.message || "Invalid email or password")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setError("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email")
      }

      setEmailVerificationSent(true)
    } catch (error) {
      setError(error.message || "Failed to resend verification email")
    } finally {
      setIsResendingVerification(false)
    }
  }

  // Helper function to render the appropriate error icon
  const getErrorIcon = () => {
    if (apiError) {
      return <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
    } else if (error.includes("incorrect") || error.includes("Invalid")) {
      return <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
    } else if (error.includes("try again later")) {
      return <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-yellow-500" />
    }
    return <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
  }

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Log In</h1>
              <p className="text-gray-600 mt-2">Welcome back to ServiceConnect! Log in to your account</p>
            </div>

            {(error || authError) && (
              <div
                className={`${apiError ? "bg-red-100" : "bg-red-100"} text-red-700 p-3 rounded-md mb-6 flex items-start`}
              >
                {getErrorIcon()}
                <span>{error || authError}</span>
              </div>
            )}

            {apiError && !error && !authError && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-6 flex items-start">
                <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>There seems to be a connection issue. Please check your internet connection and try again.</span>
              </div>
            )}

            {attempts >= 3 && !error && !apiError && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-6 flex items-start">
                <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Having trouble logging in? Make sure you're using the correct email and password.{" "}
                  <Link href="/forgot-password" className="underline font-medium">
                    Reset your password
                  </Link>
                </span>
              </div>
            )}

            {showVerificationMessage && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-6">
                <p className="mb-2">
                  Your email has not been verified. Please check your inbox for a verification email.
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification || emailVerificationSent}
                  className="text-blue-700 font-medium hover:text-blue-800 disabled:text-blue-400"
                >
                  {isResendingVerification
                    ? "Sending..."
                    : emailVerificationSent
                      ? "Email sent!"
                      : "Resend verification email"}
                </button>
              </div>
            )}

            {emailVerificationSent && !showVerificationMessage && (
              <div className="bg-green-100 text-green-700 p-3 rounded-md mb-6 flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Verification email sent! Please check your inbox and verify your email before logging in.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-700 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-700 font-medium hover:text-blue-800">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
