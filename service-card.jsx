"use client"

import { useState } from "react"
import { Star, CheckCircle, MapPin, Phone } from "lucide-react"

export default function ServiceCard() {
  const [activeService, setActiveService] = useState("welders")

  // Sample service providers data
  const serviceProviders = {
    welders: [
      {
        id: 1,
        name: "John Smith",
        profession: "Welder",
        location: "New York, NY",
        rating: 4.9,
        specialties: ["TIG Welding", "MIG Welding", "Pipe Welding"],
        hourlyRate: 75,
        image: "/placeholder.svg?height=100&width=100",
        verified: true,
      },
    ],
    electricians: [
      {
        id: 1,
        name: "Sarah Johnson",
        profession: "Electrician",
        location: "Los Angeles, CA",
        rating: 4.8,
        specialties: ["Residential Wiring", "Commercial Installations", "Troubleshooting"],
        hourlyRate: 85,
        image: "/placeholder.svg?height=100&width=100",
        verified: true,
      },
    ],
    plumbers: [
      {
        id: 1,
        name: "Michael Brown",
        profession: "Plumber",
        location: "Chicago, IL",
        rating: 4.7,
        specialties: ["Pipe Repair", "Fixture Installation", "Drain Cleaning"],
        hourlyRate: 70,
        image: "/placeholder.svg?height=100&width=100",
        verified: false,
      },
    ],
    carpenters: [
      {
        id: 1,
        name: "Emily Davis",
        profession: "Carpenter",
        location: "Denver, CO",
        rating: 4.9,
        specialties: ["Custom Furniture", "Cabinetry", "Framing"],
        hourlyRate: 65,
        image: "/placeholder.svg?height=100&width=100",
        verified: true,
      },
    ],
  }

  const serviceTypes = [
    { id: "welders", label: "Welders" },
    { id: "electricians", label: "Electricians" },
    { id: "plumbers", label: "Plumbers" },
    { id: "carpenters", label: "Carpenters" },
  ]

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-700 text-white">
        <h2 className="text-xl font-bold text-center">ServiceConnect</h2>
        <p className="text-sm text-center">Find skilled professionals for your projects</p>
      </div>

      {/* Service Type Selector */}
      <div className="flex border-b">
        {serviceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveService(type.id)}
            className={`flex-1 py-2 text-sm font-medium ${
              activeService === type.id
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500 hover:text-blue-700"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Service Provider Card */}
      {serviceProviders[activeService].map((provider) => (
        <div key={provider.id} className="p-4">
          <div className="flex items-start">
            <img
              src={provider.image || "/placeholder.svg"}
              alt={provider.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-bold">{provider.name}</h3>
                {provider.verified && (
                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{provider.profession}</p>

              <div className="flex items-center mt-1 text-sm">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{provider.rating}</span>
                <span className="text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 10} reviews)</span>
              </div>

              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{provider.location}</span>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium">Specialties:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {provider.specialties.map((specialty, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold">${provider.hourlyRate}/hr</span>
                <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center">
                  <Phone className="h-3 w-3 mr-1" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="p-4 bg-gray-50 border-t">
        <button className="w-full bg-blue-700 text-white py-2 rounded-md font-medium hover:bg-blue-800 transition-colors text-sm">
          View All {serviceTypes.find((t) => t.id === activeService)?.label}
        </button>
      </div>
    </div>
  )
}
