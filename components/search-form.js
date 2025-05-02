"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function SearchForm() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    location: "",
    service: "",
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

    // Navigate to welders page with search params
    router.push(`/welders?${queryParams.toString()}`)
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
        <label htmlFor="service" className="sr-only">
          Service
        </label>
        <select
          id="service"
          name="service"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          value={searchData.service}
          onChange={handleChange}
        >
          <option value="">Select service type</option>
          <option value="tig">TIG Welding</option>
          <option value="mig">MIG Welding</option>
          <option value="stick">Stick Welding</option>
          <option value="flux-core">Flux Core Welding</option>
          <option value="pipe">Pipe Welding</option>
          <option value="structural">Structural Welding</option>
          <option value="aluminum">Aluminum Welding</option>
          <option value="stainless">Stainless Steel Welding</option>
        </select>
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
