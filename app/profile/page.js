"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Camera, Save, Loader2 } from "lucide-react"
import { updateProfile, getUserProfile } from "@/lib/api"

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    isServiceProvider: false,
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile")
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await getUserProfile(user.id)
        const profileData = response.data

        setProfile(profileData)
        setFormData({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          isServiceProvider: profileData.is_service_provider || false,
        })
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchProfile()
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert form data to API format
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        is_service_provider: formData.isServiceProvider,
      }

      await updateProfile(user.id, apiData)
      setSuccess(true)

      // Update local user data if needed
      // This depends on how your auth context works
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-blue-700 animate-spin" />
          <span className="ml-2 text-gray-700">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and settings</p>
        </div>

        {error && (
          <div className="mx-6 my-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-6 my-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>Profile updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={`${formData.firstName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">
                      {formData.firstName?.charAt(0) || ""}
                      {formData.lastName?.charAt(0) || ""}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800"
                  title="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Profile photo</p>
            </div>

            {/* Basic Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isServiceProvider"
                name="isServiceProvider"
                checked={formData.isServiceProvider}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isServiceProvider" className="ml-2 block text-sm text-gray-700">
                Register as a Service Provider
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enable this option if you want to offer services on our platform.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
