"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import SearchForm from "@/components/search-form"
import { Filter, ChevronDown, ChevronUp, CheckCircle, MapPin, Star, DollarSign } from "lucide-react"
import Link from "next/link"

// Sample providers data - moved outside component to avoid recreating on each render
const allProviders = [
  {
    id: 1,
    name: "John Smith",
    profession: "Welder",
    location: "New York, NY",
    rating: 4.9,
    specialties: ["TIG Welding", "MIG Welding", "Pipe Welding"],
    hourlyRate: 75,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    profession: "Electrician",
    location: "Los Angeles, CA",
    rating: 4.8,
    specialties: ["Residential Wiring", "Commercial Installations", "Lighting"],
    hourlyRate: 65,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 3,
    name: "Michael Brown",
    profession: "Plumber",
    location: "Chicago, IL",
    rating: 4.7,
    specialties: ["Pipe Repair", "Fixture Installation", "Drain Cleaning"],
    hourlyRate: 70,
    image: "/placeholder.svg?height=300&width=300",
    verified: false,
  },
  {
    id: 4,
    name: "David Wilson",
    profession: "Carpenter",
    location: "Houston, TX",
    rating: 4.5,
    specialties: ["Custom Furniture", "Framing", "Cabinetry"],
    hourlyRate: 60,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 5,
    name: "Jennifer Lee",
    profession: "Welder",
    location: "Seattle, WA",
    rating: 4.9,
    specialties: ["TIG Welding", "Aluminum Welding", "Stainless Steel Welding"],
    hourlyRate: 80,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 6,
    name: "Robert Martinez",
    profession: "Electrician",
    location: "Miami, FL",
    rating: 4.6,
    specialties: ["Panel Upgrades", "Troubleshooting", "Smart Home Installation"],
    hourlyRate: 70,
    image: "/placeholder.svg?height=300&width=300",
    verified: false,
  },
  {
    id: 7,
    name: "Emily Davis",
    profession: "Painter",
    location: "Denver, CO",
    rating: 4.8,
    specialties: ["Interior Painting", "Exterior Painting", "Decorative Finishes"],
    hourlyRate: 55,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 8,
    name: "James Taylor",
    profession: "HVAC Technician",
    location: "Phoenix, AZ",
    rating: 4.7,
    specialties: ["AC Installation", "Heating Repair", "Ventilation Systems"],
    hourlyRate: 75,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: 9,
    name: "Lisa Anderson",
    profession: "Landscaper",
    location: "Portland, OR",
    rating: 4.9,
    specialties: ["Garden Design", "Lawn Maintenance", "Hardscaping"],
    hourlyRate: 60,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
]

// Service mapping - moved outside component
const serviceMapping = {
  // Welding
  tig: "TIG Welding",
  mig: "MIG Welding",
  stick: "Stick Welding",
  "flux-core": "Flux Core Welding",
  pipe: "Pipe Welding",
  structural: "Structural Welding",

  // Electrical
  residential: "Residential Wiring",
  commercial: "Commercial Installations",
  lighting: "Lighting",

  // Plumbing
  repair: "Pipe Repair",
  fixtures: "Fixture Installation",
  drains: "Drain Cleaning",

  // Carpentry
  furniture: "Custom Furniture",
  framing: "Framing",
  cabinetry: "Cabinetry",
}

export default function Providers() {
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

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
    specialties: [],
  })

  // Filter providers using useMemo to avoid unnecessary recalculations
  const filteredProviders = useMemo(() => {
    let result = [...allProviders]

    // Filter by category
    if (filters.category && filters.category !== "all") {
      result = result.filter((provider) => provider.profession.toLowerCase() === filters.category.toLowerCase())
    }

    // Filter by location
    if (filters.location) {
      result = result.filter((provider) => provider.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Filter by service/specialty
    if (filters.service) {
      const serviceToFind = serviceMapping[filters.service] || filters.service

      result = result.filter((provider) =>
        provider.specialties.some((specialty) => specialty.toLowerCase().includes(serviceToFind.toLowerCase())),
      )
    }

    // Filter by minimum rating
    if (filters.minRating) {
      result = result.filter((provider) => provider.rating >= Number.parseFloat(filters.minRating))
    }

    // Filter by maximum price
    if (filters.maxPrice) {
      result = result.filter((provider) => provider.hourlyRate <= Number.parseFloat(filters.maxPrice))
    }

    // Filter by selected specialties
    if (filters.specialties.length > 0) {
      result = result.filter((provider) =>
        filters.specialties.some((specialty) => provider.specialties.includes(specialty)),
      )
    }

    return result
  }, [filters])

  // Update filters when URL search params change
  useEffect(() => {
    const locationParam = searchParams.get("location")
    const serviceParam = searchParams.get("service")
    const categoryParam = searchParams.get("category")

    // Only update if the params have changed from what's in state
    const shouldUpdate =
      (locationParam !== null && locationParam !== filters.location) ||
      (serviceParam !== null && serviceParam !== filters.service) ||
      (categoryParam !== null && categoryParam !== filters.category)

    if (shouldUpdate) {
      setFilters((prev) => ({
        ...prev,
        location: locationParam || prev.location,
        service: serviceParam || prev.service,
        category: categoryParam || prev.category,
      }))
    }
  }, [searchParams]) // Only depend on searchParams, not filters

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFilters((prev) => {
        if (checked) {
          return {
            ...prev,
            specialties: [...prev.specialties, value],
          }
        } else {
          return {
            ...prev,
            specialties: prev.specialties.filter((specialty) => specialty !== value),
          }
        }
      })
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
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

  // Get unique professions for category filter
  const categories = useMemo(() => {
    const professions = allProviders.map((provider) => provider.profession)
    return ["all", ...new Set(professions)]
  }, [])

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 mx-1 rounded-md font-medium ${
                  activeCategory === category ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "All Providers" : `${category}s`}
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
                      specialties: [],
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
              <p className="text-gray-600">{filteredProviders.length} service providers found</p>
              <div>
                <label htmlFor="sort" className="text-gray-600 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProviders.length > 0 ? (
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
                      specialties: [],
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
        <img src={provider.image || "/placeholder.svg"} alt={provider.name} className="w-full h-48 object-cover" />
        {provider.verified && (
          <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{provider.name}</h3>
        <div className="text-gray-600 mb-2">{provider.profession}</div>
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-500 text-sm">{provider.location}</span>
        </div>
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="font-medium">{provider.rating}</span>
          <span className="text-gray-500 text-sm ml-1">({Math.floor(Math.random() * 50) + 10} reviews)</span>
        </div>
        <div className="flex items-center mb-4">
          <DollarSign className="h-4 w-4 text-gray-700 mr-1" />
          <span className="font-medium">${provider.hourlyRate}</span>
          <span className="text-gray-500 text-sm ml-1">/ hour</span>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map((specialty, index) => (
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
