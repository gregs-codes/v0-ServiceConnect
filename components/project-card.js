import Link from "next/link"
import { Calendar, MapPin, DollarSign, Clock } from "lucide-react"

export default function ProjectCard({ project }) {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format status for display
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: "bg-green-100 text-green-800", label: "Open" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { color: "bg-gray-100 text-gray-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    }

    const config = statusConfig[status] || statusConfig.open

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            <Link href={`/projects/${project.id}`} className="hover:text-blue-700 transition-colors">
              {project.title}
            </Link>
          </h3>
          {getStatusBadge(project.status)}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <span>${project.budget?.toLocaleString() || "Not specified"}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{project.location || "Remote"}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(project.created_at)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{project.estimated_duration || "Not specified"}</span>
          </div>
        </div>

        <div className="flex items-center mt-4">
          {project.service_categories && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {project.service_categories.name}
            </span>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-700 font-medium hover:text-blue-800 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
