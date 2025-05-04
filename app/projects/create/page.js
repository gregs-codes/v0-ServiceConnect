"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getServiceCategories, createProject } from "@/lib/api"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    budgetMin: "",
    budgetMax: "",
    location: "",
    isRemote: false,
    deadline: "",
  })

  // Load service categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getServiceCategories()
        setCategories(response.data || [])
        setError(null)
      } catch (err) {
        console.error("Error loading categories:", err)
        setError("Failed to load service categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.title || !formData.description || !formData.categoryId) {
      setError("Please fill in all required fields.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      // Format data for API
      const projectData = {
        ...formData,
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
      }

      const response = await createProject(projectData)

      // Redirect to the new project page
      router.push(`/projects/${response.data.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Failed to create project. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/projects" className="text-blue-700 hover:text-blue-800">
            ← Back to Projects
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Post a New Project</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Project Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Project Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Service Category */}
              <div>
                <label htmlFor="categoryId" className="block text-gray-700 font-medium mb-2">
                  Service Category <span className="text-red-600">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetMin" className="block text-gray-700 font-medium mb-2">
                    Minimum Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budgetMin"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="budgetMax" className="block text-gray-700 font-medium mb-2">
                    Maximum Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budgetMax"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Remote Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRemote"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRemote" className="ml-2 block text-gray-700">
                  This project can be done remotely
                </label>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Creating Project..." : "Post Project"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
