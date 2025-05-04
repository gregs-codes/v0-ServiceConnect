import Link from "next/link"
import { Calendar, MapPin, DollarSign, Clock } from "lucide-react"

export default function ProjectCard({ project }) {
  // Ensure we have a valid project object with fallbacks
  const data = project || {}

  // Extract properties with fallbacks
  const id = data.id || "unknown"
  const title = data.title || "Untitled Project"
  const description = data.description || "No description provided"
  const location = data.location || "Remote"
  const isRemote = data.isRemote || false
  const status = data.status || "open"
  const createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
  const deadline = data.deadline ? new Date(data.deadline) : null
  const budgetMin = data.budgetMin || 0
  const budgetMax = data.budgetMax || 0
  const category = data.category || null

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not specified"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.replace("_", " ")}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">
              {location} {isRemote && "(Remote OK)"}
            </span>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">{deadline ? formatDate(deadline) : "No deadline"}</span>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">
              {budgetMin && budgetMax
                ? `$${budgetMin} - $${budgetMax}`
                : budgetMin
                  ? `From $${budgetMin}`
                  : budgetMax
                    ? `Up to $${budgetMax}`
                    : "Budget not specified"}
            </span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">Posted {formatDate(createdAt)}</span>
          </div>
        </div>

        {category && (
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{category.name}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <Link
            href={`/projects/${id}`}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex-1 text-center"
          >
            View Details
          </Link>
          {status === "open" && (
            <Link
              href={`/projects/${id}/apply`}
              className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex-1 text-center"
            >
              Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
