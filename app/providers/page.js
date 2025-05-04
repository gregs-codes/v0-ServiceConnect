"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getProviders, getServiceCategories } from "@/lib/api"
import ProviderCard from "@/components/provider-card"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

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

  // Initialize filters
  const [filters, setFilters] = useState({
    location: initialLocation,
    serviceType: initialService,
    minRating: "",
    maxPrice: "",
  })

  // Load providers and categories
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Load service categories
        const categoriesResponse = await getServiceCategories()
        setCategories(categoriesResponse.data || [])

        // Load providers with filters
        const apiFilters = {}
        if (filters.location) apiFilters.location = filters.location
        if (filters.serviceType) apiFilters.serviceType = filters.serviceType

        const providersResponse = await getProviders(apiFilters)
        setProviders(providersResponse.data || [])
        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load service providers. Please try again later.")
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

  // Filter providers by max price client-side
  const filteredProviders = filters.maxPrice
    ? providers.filter((provider) => provider.hourlyRate <= Number.parseFloat(filters.maxPrice))
    : providers

  // Filter providers by minimum rating client-side
  const finalFilteredProviders = filters.minRating
    ? filteredProviders.filter((provider) => provider.rating >= Number.parseFloat(filters.minRating))
    : filteredProviders

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Service Providers</h1>

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
                <p className="text-gray-600">{finalFilteredProviders.length} service providers found</p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
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
