"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

// Mock categories for fallback
const MOCK_CATEGORIES = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "carpentry", name: "Carpentry" },
  { id: "painting", name: "Painting" },
  { id: "landscaping", name: "Landscaping" },
  { id: "cleaning", name: "Cleaning" },
  { id: "roofing", name: "Roofing" },
  { id: "hvac", name: "HVAC" },
]

export default function SearchForm({ darkMode = false }) {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    service: "",
    category: "",
  })
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Build query string
    const queryParams = new URLSearchParams()
    if (searchData.location) queryParams.append("location", searchData.location)
    if (searchData.service) queryParams.append("service", searchData.service)
    if (searchData.category) queryParams.append("category", searchData.category)

    // Navigate to providers page with search params
    router.push(`/providers?${queryParams.toString()}`)
  }

  // Force consistent styling for inputs
  const inputClasses = `w-full px-4 py-3 border ${
    darkMode ? "border-blue-600 bg-white/90" : "border-gray-300 bg-white"
  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500`

  const selectClasses = `w-full px-4 py-3 border ${
    darkMode ? "border-blue-600 bg-white/90" : "border-gray-300 bg-white"
  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-900`

  const buttonClasses = `${
    darkMode ? "bg-white text-blue-700 hover:bg-blue-50" : "bg-blue-700 text-white hover:bg-blue-800"
  } px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter your location"
          className={inputClasses}
          value={searchData.location}
          onChange={handleChange}
          style={{ color: "#333" }} // Force text color
        />
      </div>
      <div className="flex-1">
        <label htmlFor="category" className="sr-only">
          Service Category
        </label>
        <select
          id="category"
          name="category"
          className={selectClasses}
          value={searchData.category}
          onChange={handleChange}
          disabled={loading}
          style={{ color: "#333" }} // Force text color
        >
          <option value="">All service categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="service" className="sr-only">
          Service
        </label>
        <input
          type="text"
          id="service"
          name="service"
          placeholder="Service needed (e.g., pipe repair)"
          className={inputClasses}
          value={searchData.service}
          onChange={handleChange}
          style={{ color: "#333" }} // Force text color
        />
      </div>
      <button type="submit" className={buttonClasses}>
        <Search className="h-5 w-5 mr-2" />
        Search
      </button>
    </form>
  )
}
