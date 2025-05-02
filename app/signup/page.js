"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "client", // client or provider
    serviceType: "", // Only relevant if accountType is "provider"
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    // Validate service type is selected if account type is provider
    if (formData.accountType === "provider" && !formData.serviceType) {
      setError("Please select a service type")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the data to your backend
      router.push("/dashboard")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
              <p className="text-gray-600 mt-2">Join ServiceConnect today and connect with service professionals</p>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <p className="block text-gray-700 font-medium mb-2">I am a:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${
                      formData.accountType === "client"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: "client" }))}
                  >
                    <input
                      type="radio"
                      id="client"
                      name="accountType"
                      value="client"
                      checked={formData.accountType === "client"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label htmlFor="client" className="cursor-pointer block text-center">
                      <div className="font-bold mb-1">Client</div>
                      <div className="text-sm text-gray-600">I need to hire service professionals</div>
                    </label>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer ${
                      formData.accountType === "provider"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: "provider" }))}
                  >
                    <input
                      type="radio"
                      id="provider"
                      name="accountType"
                      value="provider"
                      checked={formData.accountType === "provider"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label htmlFor="provider" className="cursor-pointer block text-center">
                      <div className="font-bold mb-1">Service Provider</div>
                      <div className="text-sm text-gray-600">I offer professional services</div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Service Type Selection - Only shown if accountType is "provider" */}
              {formData.accountType === "provider" && (
                <div className="mb-6">
                  <label htmlFor="serviceType" className="block text-gray-700 font-medium mb-2">
                    What type of service do you provide?
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a service type</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="welding">Welding</option>
                    <option value="painting">Painting</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="hvac">HVAC</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength="8"
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
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-700 hover:text-blue-800">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-700 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.agreeTerms}
                className="w-full bg-blue-700 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-700 font-medium hover:text-blue-800">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
