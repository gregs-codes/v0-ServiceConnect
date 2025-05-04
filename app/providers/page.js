"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Filter, ChevronDown, ChevronUp, CheckCircle, MapPin, Star, DollarSign } from "lucide-react"
import SearchForm from "@/components/search-form"
import { getProviders, getServiceCategories } from "@/lib/api"

export default function Providers() {
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get search params once on initial render
  const initialLocation = searchParams.get("location") || ""
  const initialService = searchParams.get("service") || ""
  const initialCategory = searchParams.get("category") || "all"

  // Initialize filters with search params
  const [filters, setFilters] = useState({
    location: initialLocation,
    service: initialService,
    category: initialCategory,
    minRating: "",
    maxPrice: "",
  })

  // Fetch providers and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch service categories
        const categoriesResponse = await getServiceCategories()
        const fetchedCategories = categoriesResponse.data || []
        setCategories(fetchedCategories)

        // Fetch providers with filters
        const apiFilters = {}
        if (filters.location) apiFilters.location = filters.location
        if (filters.category && filters.category !== "all") apiFilters.category = filters.category
        if (filters.minRating) apiFilters.minRating = filters.minRating

        const providersResponse = await getProviders(apiFilters)
        setProviders(providersResponse.data || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load providers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters.location, filters.category, filters.minRating])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setFilters((prev) => ({
      ...prev,
      category: category,
    }))
  }

  // Filter providers by max price client-side
  const filteredProviders = filters.maxPrice
    ? providers.filter((provider) => provider.hourlyRate <= Number.parseFloat(filters.maxPrice))
    : providers

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Service Providers</h1>

        {/* Search Form */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <SearchForm />
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-x-auto">
          <div className="flex p-1 min-w-max">
            <button
              key="all"
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 mx-1 rounded-md font-medium ${
                activeCategory === "all" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Providers
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 mx-1 rounded-md font-medium ${
                  activeCategory === category.id
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
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
                {/* Rating Filter */}
                <div>
                  <label htmlFor="minRating" className="block text-gray-700 font-medium mb-2">
                    Minimum Rating
                  </label>
                  <select
                    id="minRating"
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                    <option value="3.0">3.0+</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label htmlFor="maxPrice" className="block text-gray-700 font-medium mb-2">
                    Maximum Hourly Rate
                  </label>
                  <select
                    id="maxPrice"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Price</option>
                    <option value="50">$50 or less</option>
                    <option value="75">$75 or less</option>
                    <option value="100">$100 or less</option>
                    <option value="150">$150 or less</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      location: "",
                      service: "",
                      category: "all",
                      minRating: "",
                      maxPrice: "",
                    })
                  }
                  className="text-blue-700 font-medium hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Providers List */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              {loading ? (
                <p className="text-gray-600">Loading providers...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <p className="text-gray-600">{filteredProviders.length} service providers found</p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">No service providers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria to find more results.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      location: "",
                      service: "",
                      category: "all",
                      minRating: "",
                      maxPrice: "",
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

// Provider Card Component
function ProviderCard({ provider }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={provider.avatar || "/placeholder.svg?height=300&width=300"}
          alt={provider.name}
          className="w-full h-48 object-cover"
        />
        {provider.verified && (
          <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{provider.name}</h3>
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-500 text-sm">{provider.location}</span>
        </div>
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="font-medium">{provider.rating || "New"}</span>
          {provider.reviews > 0 && <span className="text-gray-500 text-sm ml-1">({provider.reviews} reviews)</span>}
        </div>
        <div className="flex items-center mb-4">
          <DollarSign className="h-4 w-4 text-gray-700 mr-1" />
          <span className="font-medium">${provider.hourlyRate}</span>
          <span className="text-gray-500 text-sm ml-1">/ hour</span>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.specialties &&
              provider.specialties.map((specialty, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/providers/${provider.id}`}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex-1 text-center"
          >
            View Profile
          </Link>
          <Link
            href={`/contact/${provider.id}`}
            className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex-1 text-center"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  )
}
