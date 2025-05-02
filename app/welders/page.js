"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import WelderCard from "@/components/welder-card"
import SearchForm from "@/components/search-form"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

export default function Welders() {
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    service: searchParams.get("service") || "",
    minRating: "",
    maxPrice: "",
    specialties: [],
  })

  // Sample welders data
  const allWelders = [
    {
      id: 1,
      name: "John Smith",
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
      location: "Los Angeles, CA",
      rating: 4.8,
      specialties: ["Structural Welding", "Aluminum Welding"],
      hourlyRate: 65,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 3,
      name: "Michael Brown",
      location: "Chicago, IL",
      rating: 4.7,
      specialties: ["Sheet Metal Welding", "Stainless Steel Welding"],
      hourlyRate: 70,
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
    },
    {
      id: 4,
      name: "David Wilson",
      location: "Houston, TX",
      rating: 4.5,
      specialties: ["MIG Welding", "Flux Core Welding"],
      hourlyRate: 60,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 5,
      name: "Jennifer Lee",
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
      location: "Miami, FL",
      rating: 4.6,
      specialties: ["Structural Welding", "Pipe Welding"],
      hourlyRate: 70,
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
    },
    {
      id: 7,
      name: "Emily Davis",
      location: "Denver, CO",
      rating: 4.8,
      specialties: ["TIG Welding", "Artistic Welding"],
      hourlyRate: 85,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 8,
      name: "James Taylor",
      location: "Phoenix, AZ",
      rating: 4.7,
      specialties: ["MIG Welding", "Automotive Welding"],
      hourlyRate: 65,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 9,
      name: "Lisa Anderson",
      location: "Portland, OR",
      rating: 4.9,
      specialties: ["TIG Welding", "Precision Welding", "Aluminum Welding"],
      hourlyRate: 90,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
  ]

  const [filteredWelders, setFilteredWelders] = useState(allWelders)

  // Update filters when search params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get("location") || prev.location,
      service: searchParams.get("service") || prev.service,
    }))
  }, [searchParams])

  // Apply filters
  useEffect(() => {
    let result = [...allWelders]

    // Filter by location
    if (filters.location) {
      result = result.filter((welder) => welder.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Filter by service/specialty
    if (filters.service) {
      const serviceMapping = {
        tig: "TIG Welding",
        mig: "MIG Welding",
        stick: "Stick Welding",
        "flux-core": "Flux Core Welding",
        pipe: "Pipe Welding",
        structural: "Structural Welding",
        aluminum: "Aluminum Welding",
        stainless: "Stainless Steel Welding",
      }

      const serviceToFind = serviceMapping[filters.service] || filters.service

      result = result.filter((welder) =>
        welder.specialties.some((specialty) => specialty.toLowerCase().includes(serviceToFind.toLowerCase())),
      )
    }

    // Filter by minimum rating
    if (filters.minRating) {
      result = result.filter((welder) => welder.rating >= Number.parseFloat(filters.minRating))
    }

    // Filter by maximum price
    if (filters.maxPrice) {
      result = result.filter((welder) => welder.hourlyRate <= Number.parseFloat(filters.maxPrice))
    }

    // Filter by selected specialties
    if (filters.specialties.length > 0) {
      result = result.filter((welder) =>
        filters.specialties.some((specialty) => welder.specialties.includes(specialty)),
      )
    }

    setFilteredWelders(result)
  }, [filters])

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

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Welders</h1>

        {/* Search Form */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <SearchForm />
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

                {/* Specialties Filter */}
                <div>
                  <p className="block text-gray-700 font-medium mb-2">Specialties</p>
                  <div className="space-y-2">
                    {[
                      "TIG Welding",
                      "MIG Welding",
                      "Stick Welding",
                      "Flux Core Welding",
                      "Pipe Welding",
                      "Structural Welding",
                      "Aluminum Welding",
                      "Stainless Steel Welding",
                    ].map((specialty) => (
                      <div key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          id={specialty.replace(/\s+/g, "-").toLowerCase()}
                          name="specialties"
                          value={specialty}
                          checked={filters.specialties.includes(specialty)}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={specialty.replace(/\s+/g, "-").toLowerCase()} className="ml-2 text-gray-700">
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      location: "",
                      service: "",
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

          {/* Welders List */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredWelders.length} welders found</p>
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

            {filteredWelders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWelders.map((welder) => (
                  <WelderCard key={welder.id} welder={welder} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">No welders found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria to find more results.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      location: "",
                      service: "",
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
