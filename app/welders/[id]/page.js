"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, CheckCircle, Send } from "lucide-react"

// This would typically come from a database or API
const getWelderById = (id) => {
  const welders = [
    {
      id: 1,
      name: "John Smith",
      location: "New York, NY",
      rating: 4.9,
      reviews: 48,
      specialties: ["TIG Welding", "MIG Welding", "Pipe Welding"],
      hourlyRate: 75,
      dailyRate: 550,
      image: "/placeholder.svg?height=400&width=400",
      verified: true,
      about:
        "Professional welder with over 15 years of experience in industrial and commercial welding. Specialized in high-precision TIG welding and complex pipe systems. Certified in AWS D1.1 Structural Welding and ASME Section IX.",
      experience: [
        {
          title: "Senior Welder",
          company: "Industrial Metals Inc.",
          period: "2015 - Present",
          description: "Lead welder for major industrial projects, specializing in pressure vessels and pipe systems.",
        },
        {
          title: "Welder",
          company: "Construction Solutions LLC",
          period: "2010 - 2015",
          description: "Performed structural welding for commercial construction projects.",
        },
        {
          title: "Apprentice Welder",
          company: "City Metal Works",
          period: "2008 - 2010",
          description: "Trained under master welders while assisting with various welding projects.",
        },
      ],
      certifications: ["AWS D1.1 Structural Welding", "ASME Section IX", "API 1104 Pipeline Welding"],
      portfolio: [
        {
          title: "Industrial Pipe System",
          image: "/placeholder.svg?height=300&width=400",
          description: "Complex stainless steel pipe system for a chemical processing plant.",
        },
        {
          title: "Structural Steel Framework",
          image: "/placeholder.svg?height=300&width=400",
          description: "Welded framework for a commercial building.",
        },
        {
          title: "Custom Metal Staircase",
          image: "/placeholder.svg?height=300&width=400",
          description: "Artistic staircase made from steel and aluminum.",
        },
      ],
      reviews: [
        {
          name: "Robert Johnson",
          rating: 5,
          date: "October 15, 2023",
          text: "John did an excellent job on our industrial equipment repair. Professional, punctual, and high-quality work.",
        },
        {
          name: "Sarah Williams",
          rating: 5,
          date: "September 3, 2023",
          text: "Hired John for a custom metal railing project. His attention to detail and craftsmanship exceeded my expectations.",
        },
        {
          name: "Michael Davis",
          rating: 4,
          date: "August 22, 2023",
          text: "Good work on our pipe system installation. Completed on time and within budget.",
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "Los Angeles, CA",
      rating: 4.8,
      reviews: 36,
      specialties: ["Structural Welding", "Aluminum Welding"],
      hourlyRate: 65,
      dailyRate: 480,
      image: "/placeholder.svg?height=400&width=400",
      verified: true,
      about:
        "Specialized in structural and aluminum welding with 10 years of experience in the construction industry. Known for precision work and attention to detail. Certified in AWS D1.1 Structural Welding.",
      experience: [
        {
          title: "Lead Welder",
          company: "West Coast Construction",
          period: "2018 - Present",
          description: "Responsible for structural welding on commercial and residential projects.",
        },
        {
          title: "Welder",
          company: "Aluminum Specialists Inc.",
          period: "2013 - 2018",
          description: "Specialized in aluminum welding for custom architectural elements.",
        },
      ],
      certifications: ["AWS D1.1 Structural Welding", "AWS D1.2 Aluminum Welding"],
      portfolio: [
        {
          title: "Commercial Building Framework",
          image: "/placeholder.svg?height=300&width=400",
          description: "Structural steel framework for a multi-story commercial building.",
        },
        {
          title: "Aluminum Storefront",
          image: "/placeholder.svg?height=300&width=400",
          description: "Custom aluminum storefront for a retail space.",
        },
      ],
      reviews: [
        {
          name: "David Wilson",
          rating: 5,
          date: "November 5, 2023",
          text: "Sarah's work on our building's structural elements was exceptional. Highly recommended.",
        },
        {
          name: "Emily Brown",
          rating: 4,
          date: "October 12, 2023",
          text: "Great work on our aluminum railings. Professional and reliable.",
        },
      ],
    },
  ]

  return welders.find((welder) => welder.id === Number.parseInt(id)) || welders[0]
}

export default function WelderProfile({ params }) {
  const welder = getWelderById(params.id)
  const [activeTab, setActiveTab] = useState("about")
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectDetails: "",
    startDate: "",
  })

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
    alert("Your message has been sent! The welder will contact you soon.")
    setContactForm({
      name: "",
      email: "",
      phone: "",
      projectDetails: "",
      startDate: "",
    })
    setShowContactForm(false)
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link href="/welders" className="inline-flex items-center text-blue-700 font-medium mb-8 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Welders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Welder Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="relative">
                <img src={welder.image || "/placeholder.svg"} alt={welder.name} className="w-full h-64 object-cover" />
                {welder.verified && (
                  <div className="absolute top-4 right-4 bg-blue-700 text-white px-3 py-1 rounded-full flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{welder.name}</h1>

                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{welder.location}</span>
                </div>

                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="font-medium">{welder.rating}</span>
                  <span className="text-gray-500 ml-1">({welder.reviews} reviews)</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Rates:</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-bold">${welder.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-bold">${welder.dailyRate}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Specialties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {welder.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
                >
                  Contact Welder
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-6 py-3 font-medium ${activeTab === "about" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`px-6 py-3 font-medium ${activeTab === "experience" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab("portfolio")}
                  className={`px-6 py-3 font-medium ${activeTab === "portfolio" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 font-medium ${activeTab === "reviews" ? "text-blue-700 border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700"}`}
                >
                  Reviews
                </button>
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === "about" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About {welder.name}</h2>
                    <p className="text-gray-700 mb-6">{welder.about}</p>

                    <h3 className="text-xl font-bold mb-3">Certifications</h3>
                    <ul className="list-disc pl-5 mb-6">
                      {welder.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-700 mb-1">
                          {cert}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Availability</h3>
                      <p className="text-gray-700">
                        Available for projects starting immediately. Typically books 2-3 weeks in advance for larger
                        projects.
                      </p>
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Work Experience</h2>

                    <div className="space-y-8">
                      {welder.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-700 pl-4">
                          <h3 className="text-xl font-bold">{exp.title}</h3>
                          <p className="text-gray-600 mb-2">
                            {exp.company} | {exp.period}
                          </p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === "portfolio" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Project Portfolio</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {welder.portfolio.map((project, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                            <p className="text-gray-700">{project.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Client Reviews</h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-bold">{welder.rating}</span>
                        <span className="text-gray-500 ml-1">({welder.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {welder.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{review.name}</h3>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                            ))}
                          </div>
                          <p className="text-gray-700">{review.text}</p>
                        </div>
                      ))}
                    </div>
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
                  <h2 className="text-2xl font-bold">Contact {welder.name}</h2>
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
