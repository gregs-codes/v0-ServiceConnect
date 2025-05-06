"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getProviders, getServiceCategories } from "@/lib/api"
import ProviderCard from "@/components/provider-card"
import PageHeader from "@/components/page-header"
import { Filter, ChevronDown, ChevronUp, Search } from "lucide-react"

export default function ProvidersPage() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get search params
  const initialLocation = searchParams.get("location") || ""
  const initialService = searchParams.get("service") || ""
  const initialCategory = searchParams.get("category") || ""

  // Initialize filters
  const [filters, setFilters] = useState({
    location: initialLocation,
    serviceType: initialCategory || initialService, // Use either category or service
    minRating: "",
    maxPrice: "",
  })

  // Load providers and categories
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load service categories
        try {
          const categoriesResponse = await getServiceCategories()
          setCategories(categoriesResponse.data || [])
        } catch (err) {
          console.error("Error loading categories:", err)
          setCategories([])
          // Don't set the error state here to allow providers to still load
        }

        // Load providers with filters
        const apiFilters = {}
        if (filters.location) apiFilters.location = filters.location
        if (filters.serviceType) apiFilters.categoryId = filters.serviceType

        try {
          const providersResponse = await getProviders(apiFilters)
          setProviders(providersResponse.data || [])
        } catch (err) {
          console.error("Error loading providers:", err)
          setError("Failed to load service providers. Please try again later.")
          setProviders([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters.location, filters.serviceType])

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

  // Filter providers by minimum rating client-side
  const finalFilteredProviders = filters.minRating
    ? providers.filter(
        (provider) => provider.averageRating !== null && provider.averageRating >= Number.parseFloat(filters.minRating),
      )
    : providers

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Find Service Providers"
        subtitle="Connect with qualified professionals for your home, business, or personal projects"
      >
        {/* Quick Search Bar */}
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm max-w-3xl mx-auto mt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full px-4 py-3 border border-blue-400 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <select
                className="w-full px-4 py-3 border border-blue-400 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-900"
                value={filters.serviceType}
                onChange={(e) => setFilters((prev) => ({ ...prev, serviceType: e.target.value }))}
              >
                <option value="">All service categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                // This will trigger the useEffect since we're changing the filters
                setFilters((prev) => ({ ...prev }))
              }}
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <span className="flex items-center font-medium">
                <Filter className="h-5 w-5 mr-2" /> Advanced Filters
              </span>
              {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>

          {/* Filters */}
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block lg:w-1/4`}>
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <h2 className="text-xl font-bold mb-6">Advanced Filters</h2>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter city or region"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Service Type Filter */}
                <div>
                  <label htmlFor="serviceType" className="block text-gray-700 font-medium mb-2">
                    Service Type
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={filters.serviceType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Services</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

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

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      location: "",
                      serviceType: "",
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
                <p className="text-gray-600">
                  <strong>{finalFilteredProviders.length}</strong> service providers found
                </p>
              )}

              {/* Sort options could go here */}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2 text-red-600">Error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : finalFilteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finalFilteredProviders.map((provider) => (
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
                      serviceType: "",
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
