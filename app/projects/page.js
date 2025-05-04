"use client"

import { useState, useEffect } from "react"
import { getProjects, getServiceCategories } from "@/lib/api"
import ProjectCard from "@/components/project-card"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Initialize filters
  const [filters, setFilters] = useState({
    status: "open",
    categoryId: "",
  })

  // Load projects and categories
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Load service categories
        const categoriesResponse = await getServiceCategories()
        setCategories(categoriesResponse.data || [])

        // Load projects with filters
        const apiFilters = {}
        if (filters.status) apiFilters.status = filters.status
        if (filters.categoryId) apiFilters.categoryId = filters.categoryId

        const projectsResponse = await getProjects(apiFilters)
        setProjects(projectsResponse.data || [])
        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters.status, filters.categoryId])

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Toggle filter panel on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Available Projects</h1>
          <Link
            href="/projects/create"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            Post a Project
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <span className="flex items-center font-medium">
                <Filter className="h-5 w-5 mr-2" /> Filters
              </span>
              {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>

          {/* Filters */}
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block lg:w-1/4`}>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              <div className="space-y-6">
                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                    Project Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
                    Service Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      categoryId: "",
                    })
                  }
                  className="text-blue-700 font-medium hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              {loading ? (
                <p className="text-gray-600">Loading projects...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <p className="text-gray-600">{projects.length} projects found</p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new projects.</p>
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      categoryId: "",
                    })
                  }
                  className="text-blue-700 font-medium hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
