"use client"

import { useState, useEffect } from "react"
import { getUserProfile, getUserCertifications, updateUserProfile } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Award, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"

export default function ProfilePage() {
  // Mock user ID for demo purposes - in a real app, this would come from authentication
  const userId = "11111111-1111-1111-1111-111111111111"

  const [profile, setProfile] = useState(null)
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  })

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true)

        // Load user profile
        const profileResponse = await getUserProfile(userId)
        setProfile(profileResponse.data)

        // Initialize form data
        setFormData({
          firstName: profileResponse.data.firstName || "",
          lastName: profileResponse.data.lastName || "",
          email: profileResponse.data.email || "",
          phone: profileResponse.data.phone || "",
          bio: profileResponse.data.bio || "",
          location: profileResponse.data.location || "",
        })

        // Load certifications
        const certificationsResponse = await getUserCertifications(userId)
        setCertifications(certificationsResponse.data || [])

        setError(null)
      } catch (err) {
        console.error("Error loading profile data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [userId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateUserProfile(userId, formData)

      // Update local state
      setProfile((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
      }))

      setEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p>Profile not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    return `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
            {!editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Certifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                {editing ? (
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={profile.avatar || "/placeholder.svg"}
                            alt={`${profile.firstName} ${profile.lastName}`}
                          />
                          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl">
                            {profile.firstName} {profile.lastName}
                          </CardTitle>
                          <CardDescription>{profile.isServiceProvider ? "Service Provider" : "Client"}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">About</h3>
                          <p className="text-gray-700">{profile.bio || "No bio provided."}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <span>{profile.location || "Location not specified"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-gray-500" />
                            <span>{profile.phone || "Phone not provided"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span>{profile.email}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span>Member since {format(new Date(profile.createdAt), "MMMM yyyy")}</span>
                          </div>
                        </div>

                        {profile.isServiceProvider && profile.skills && profile.skills.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-lg font-medium">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="certifications">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Credentials</CardTitle>
                  <CardDescription>Your professional certifications and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {certifications.length > 0 ? (
                    <div className="space-y-6">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{cert.name}</h3>
                              <p className="text-gray-600">{cert.issuingOrganization}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50">
                              {new Date(cert.expiryDate) > new Date() ? "Active" : "Expired"}
                            </Badge>
                          </div>

                          <div className="mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Issued:</span>
                              <span>{format(new Date(cert.issueDate), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Expires:</span>
                              <span>{format(new Date(cert.expiryDate), "MMMM d, yyyy")}</span>
                            </div>
                            {cert.credentialId && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Credential ID:</span>
                                <span>{cert.credentialId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold mb-2">No certifications yet</h3>
                      <p className="text-gray-600">Add your professional certifications to enhance your profile.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
