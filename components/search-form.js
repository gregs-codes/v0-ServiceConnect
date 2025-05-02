"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function SearchForm() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    service: "",
    category: "",
  })

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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchData.location}
          onChange={handleChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="category" className="sr-only">
          Provider Type
        </label>
        <select
          id="category"
          name="category"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          value={searchData.category}
          onChange={handleChange}
        >
          <option value="">All provider types</option>
          <option value="welder">Welder</option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="carpenter">Carpenter</option>
          <option value="painter">Painter</option>
          <option value="hvac">HVAC Technician</option>
          <option value="landscaper">Landscaper</option>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchData.service}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
      >
        <Search className="h-5 w-5 mr-2" />
        Search
      </button>
    </form>
  )
}
