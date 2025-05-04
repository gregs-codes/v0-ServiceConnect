"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, CheckCircle, Send } from "lucide-react"
import { getProviderById } from "@/lib/api"

export default function ProviderProfile({ params }) {
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("about")
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectDetails: "",
    startDate: "",
  })

  useEffect(() => {
    async function loadProvider() {
      try {
        setLoading(true)
        const response = await getProviderById(params.id)
        setProvider(response.data)
      } catch (err) {
        console.error("Error loading provider:", err)
        setError("Failed to load provider details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProvider()
  }, [params.id])

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    alert("Your message has been sent! The service provider will contact you soon.")
    setContactForm({
      name: "",
      email: "",
      phone: "",
      projectDetails: "",
      startDate: "",
    })
    setShowContactForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/providers" className="mt-4 inline-block text-blue-700 font-medium hover:text-blue-800">
            Back to Service Providers
          </Link>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Provider Not Found</h2>
          <p className="text-yellow-600">The service provider you're looking for doesn't exist or has been removed.</p>
          <Link href="/providers" className="mt-4 inline-block text-blue-700 font-medium hover:text-blue-800">
            Back to Service Providers
          </Link>
        </div>
      </div>
    )
  }

  // Safely extract provider data with fallbacks
  const providerName = provider.name || "Unknown Provider"
  const profession = (provider.services && provider.services[0]?.category?.name) || "Service Provider"
  const location = provider.location || "Location not specified"
  const rating = provider.rating || 0
  const totalReviews = provider.totalReviews || 0
  const hourlyRate = provider.hourlyRate || 0
  const dailyRate = hourlyRate * 8 || 0
  const bio = provider.bio || "No bio available"
  const skills = provider.skills || []
  const services = provider.services || []
  const reviews = provider.reviews || []
  const avatar = provider.avatar || "/abstract-profile.png"
  const verified = provider.verified || false

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link href="/providers" className="inline-flex items-center text-blue-700 font-medium mb-8 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Service Providers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Provider Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="relative">
                <img src={avatar || "/placeholder.svg"} alt={providerName} className="w-full h-64 object-cover" />
                {verified && (
                  <div className="absolute top-4 right-4 bg-blue-700 text-white px-3 py-1 rounded-full flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{providerName}</h1>
                <p className="text-gray-600 mb-3">{profession}</p>

                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{location}</span>
                </div>

                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="font-medium">{rating}</span>
                  <span className="text-gray-500 ml-1">({totalReviews} reviews)</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Rates:</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-bold">${hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-bold">${dailyRate}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                    {skills.length === 0 && <span className="text-gray-500">No skills listed</span>}
                  </div>
                </div>

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
                >
                  Contact Provider
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="flex border-b overflow-x-auto">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "about" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "services" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "reviews" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  Reviews
                </button>
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === "about" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About {providerName}</h2>
                    <p className="text-gray-700 mb-6">{bio}</p>

                    {skills.length > 0 && (
                      <>
                        <h3 className="text-xl font-bold mb-3">Skills</h3>
                        <ul className="list-disc pl-5 mb-6">
                          {skills.map((skill, index) => (
                            <li key={index} className="text-gray-700 mb-1">
                              {skill.name} {skill.level && `- ${skill.level}`}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Availability</h3>
                      <p className="text-gray-700">
                        {provider.status === "available"
                          ? "Available for projects starting immediately."
                          : "Currently unavailable for new projects."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Services Offered</h2>

                    {services.length > 0 ? (
                      <div className="space-y-6">
                        {services.map((service, index) => (
                          <div key={index} className="border-l-4 border-blue-700 pl-4">
                            <h3 className="text-xl font-bold">{service.category?.name || "Service"}</h3>
                            <p className="text-gray-600 mb-2">
                              {service.yearsExperience > 0 && `${service.yearsExperience} years experience`}
                            </p>
                            <p className="text-gray-700">{service.description || "No description provided."}</p>
                            {service.certified && (
                              <div className="mt-2 flex items-center text-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" /> Certified
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No services listed yet.</p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Client Reviews</h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-bold">{rating}</span>
                        <span className="text-gray-500 ml-1">({totalReviews} reviews)</span>
                      </div>
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold">{review.reviewer?.name || "Anonymous"}</h3>
                              <span className="text-gray-500 text-sm">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Contact {providerName}</h2>
                  <button onClick={() => setShowContactForm(false)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleContactSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Your Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                      Project Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={contactForm.startDate}
                      onChange={handleContactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="projectDetails" className="block text-gray-700 font-medium mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="projectDetails"
                      name="projectDetails"
                      value={contactForm.projectDetails}
                      onChange={handleContactChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
