import Link from "next/link"
import { Star, CheckCircle, MapPin, DollarSign } from "lucide-react"

export default function WelderCard({ welder }) {
  // Ensure we have a valid welder object with fallbacks
  const provider = welder || {}

  // Extract properties with fallbacks
  const id = provider.id || "unknown"
  const name = provider.name || "Unknown Provider"
  const image = provider.image || provider.avatar || "/abstract-profile.png"
  const verified = provider.verified || false
  const location = provider.location || "Location not specified"
  const rating = provider.rating || 0
  const hourlyRate = provider.hourlyRate || 0
  const specialties = provider.specialties || provider.skills || []

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
        {verified && (
          <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-500 text-sm">{location}</span>
        </div>
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="font-medium">{rating}</span>
          <span className="text-gray-500 text-sm ml-1">
            (
            {typeof provider.totalReviews !== "undefined" ? provider.totalReviews : Math.floor(Math.random() * 50) + 10}{" "}
            reviews)
          </span>
        </div>
        <div className="flex items-center mb-4">
          <DollarSign className="h-4 w-4 text-gray-700 mr-1" />
          <span className="font-medium">${hourlyRate}</span>
          <span className="text-gray-500 text-sm ml-1">/ hour</span>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.length > 0 ? (
              specialties.map((specialty, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {typeof specialty === "string" ? specialty : specialty.name || "Skill"}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">No specialties listed</span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/providers/${id}`}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex-1 text-center"
          >
            View Profile
          </Link>
          <Link
            href={`/contact?provider=${id}`}
            className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex-1 text-center"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
