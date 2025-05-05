import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const categoryId = searchParams.get("categoryId")
    const location = searchParams.get("location")

    console.log("Fetching providers with filters:", { categoryId, location })

    // Step 1: Get provider services
    let servicesQuery = supabaseAdmin.from("provider_services").select(`
      id,
      description,
      years_experience,
      is_certified,
      certification_details,
      provider_id,
      category_id
    `)

    // Add category filter if it exists
    if (categoryId && categoryId !== "null" && categoryId !== "") {
      servicesQuery = servicesQuery.eq("category_id", categoryId)
    }

    const { data: services, error: servicesError } = await servicesQuery

    if (servicesError) {
      console.error("Database error (services):", servicesError)
      return NextResponse.json(
        { error: "Failed to fetch provider services", details: servicesError.message },
        { status: 500 },
      )
    }

    console.log(`Found ${services?.length || 0} provider services`)

    // If no services found, return mock data for testing
    if (!services || services.length === 0) {
      console.log("No provider services found, returning mock data")
      return NextResponse.json({
        data: [
          {
            id: "mock-provider-1",
            serviceId: "mock-service-1",
            name: "John Doe (Mock)",
            avatar: null,
            location: "New York, NY",
            category: "Plumbing",
            categoryId: "mock-category-1",
            description: "Professional plumbing services with 10+ years of experience.",
            yearsExperience: 10,
            isCertified: true,
            certificationDetails: "Licensed Master Plumber",
            averageRating: 4.8,
          },
          {
            id: "mock-provider-2",
            serviceId: "mock-service-2",
            name: "Jane Smith (Mock)",
            avatar: null,
            location: "Los Angeles, CA",
            category: "Electrical",
            categoryId: "mock-category-2",
            description: "Certified electrician specializing in residential and commercial projects.",
            yearsExperience: 8,
            isCertified: true,
            certificationDetails: "Certified Electrician",
            averageRating: 4.5,
          },
        ],
      })
    }

    // Step 2: Get categories for the services
    const categoryIds = [...new Set(services.map((s) => s.category_id).filter(Boolean))]
    let categories = []

    if (categoryIds.length > 0) {
      const { data: categoriesData, error: categoriesError } = await supabaseAdmin
        .from("service_categories")
        .select("id, name")
        .in("id", categoryIds)

      if (categoriesError) {
        console.error("Database error (categories):", categoriesError)
      } else {
        categories = categoriesData
        console.log(`Found ${categories.length} categories`)
      }
    }

    // Step 3: Get profiles for the providers
    const providerIds = [...new Set(services.map((s) => s.provider_id).filter(Boolean))]
    let profiles = []

    if (providerIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .in("id", providerIds)

      if (profilesError) {
        console.error("Database error (profiles):", profilesError)
      } else {
        profiles = profilesData
        console.log(`Found ${profiles.length} profiles`)
      }
    }

    // Step 4: Get users for additional info if needed
    let users = []
    if (providerIds.length > 0) {
      const { data: usersData, error: usersError } = await supabaseAdmin
        .from("users")
        .select("id, email")
        .in("id", providerIds)

      if (usersError) {
        console.error("Database error (users):", usersError)
      } else {
        users = usersData
        console.log(`Found ${users.length} users`)
      }
    }

    // Step 5: Combine the data
    const providers = services.map((service) => {
      const category = categories.find((c) => c.id === service.category_id) || {}
      const profile = profiles.find((p) => p.id === service.provider_id) || {}
      const user = users.find((u) => u.id === service.provider_id) || {}

      // Determine name based on available fields
      let name = "Unknown Provider"
      if (profile.full_name) {
        name = profile.full_name
      } else if (profile.first_name || profile.last_name) {
        name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      } else if (profile.username) {
        name = profile.username
      } else if (user.email) {
        name = user.email.split("@")[0] // Use part before @ in email
      }

      return {
        id: service.provider_id,
        serviceId: service.id,
        name,
        avatar: profile.avatar_url || null,
        location: profile.location || "Location not specified",
        category: category.name || "Uncategorized",
        categoryId: service.category_id,
        description: service.description,
        yearsExperience: service.years_experience,
        isCertified: service.is_certified,
        certificationDetails: service.certification_details,
        // We would calculate this from reviews in a real app
        averageRating: Math.random() * 2 + 3, // Random rating between 3-5 for demo
      }
    })

    console.log(`Returning ${providers.length} providers`)

    // Step 6: Filter by location if needed
    let filteredProviders = providers
    if (location && location.trim() !== "") {
      const locationLower = location.toLowerCase()
      filteredProviders = providers.filter(
        (provider) => provider.location && provider.location.toLowerCase().includes(locationLower),
      )
      console.log(`After location filtering: ${filteredProviders.length} providers`)
    }

    return NextResponse.json({ data: filteredProviders })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
