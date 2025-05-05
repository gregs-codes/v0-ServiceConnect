import Link from "next/link"
import { Star } from "lucide-react"

export default function ProviderCard({ provider }) {
  // Format the rating to display with one decimal place
  const formattedRating = provider.averageRating ? provider.averageRating.toFixed(1) : "N/A"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
            {provider.avatar ? (
              <img
                src={provider.avatar || "/placeholder.svg"}
                alt={`${provider.name}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold">{provider.name}</h3>
            <p className="text-gray-600 text-sm">{provider.location}</p>
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {provider.category}
          </span>
          {provider.isCertified && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
              Certified
            </span>
          )}
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400 mr-2">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{formattedRating}</span>
          </div>
          <span className="text-sm text-gray-500">
            {provider.yearsExperience} {provider.yearsExperience === 1 ? "year" : "years"} experience
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{provider.description}</p>

        <Link
          href={`/providers/${provider.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
