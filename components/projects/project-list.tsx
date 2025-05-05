import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Project = {
  id: string
  title: string
  description: string
  budget: number
  status: string
  created_at: string
  service_categories: {
    name: string
    icon: string
  }
}

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No projects found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge variant={getStatusVariant(project.status)}>{formatStatus(project.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-medium">${project.budget.toLocaleString()}</span>
              </div>
              <div>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "open":
      return "default"
    case "in_progress":
      return "secondary"
    case "completed":
      return "success"
    default:
      return "outline"
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
