import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Helper function for API responses
function apiResponse(data, message = "", status = 200) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
    },
    { status },
  )
}

// GET method to retrieve service providers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("serviceType")
    const location = searchParams.get("location")
    const minRating = searchParams.get("minRating")

    // Start with a base query
    let query = supabaseAdmin
      .from("profiles")
      .select(`
        id,
        users (id, first_name, last_name, email, avatar_url),
        location,
        hourly_rate,
        average_rating,
        total_reviews,
        bio,
        availability_status,
        provider_services (
          id,
          category_id,
          service_categories (id, name),
          description,
          is_certified,
          years_experience
        ),
        provider_skills (
          skill_id,
          proficiency_level,
          skills (id, name)
        )
      `)
      .eq("is_service_provider", true)

    // Apply filters if provided
    if (serviceType) {
      query = query.filter("provider_services.service_categories.name", "ilike", `%${serviceType}%`)
    }

    if (location) {
      query = query.filter("location", "ilike", `%${location}%`)
    }

    if (minRating && !isNaN(minRating)) {
      query = query.gte("average_rating", Number.parseFloat(minRating))
    }

    // Execute the query
    const { data: providers, error } = await query

    if (error) {
      console.error("Database error:", error)
      return apiResponse(null, "Failed to retrieve providers", 500)
    }

    // Transform the data to match our API format
    const formattedProviders = providers.map((provider) => {
      const user = provider.users
      const services = provider.provider_services || []
      const skills = provider.provider_skills || []

      return {
        id: provider.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: user.avatar_url,
        location: provider.location,
        hourlyRate: provider.hourly_rate,
        rating: provider.average_rating,
        reviews: provider.total_reviews,
        bio: provider.bio,
        status: provider.availability_status,
        specialties: skills.map((skill) => skill.skills?.name).filter(Boolean),
        services: services.map((service) => ({
          id: service.id,
          category: service.service_categories?.name,
          description: service.description,
          certified: service.is_certified,
          experience: service.years_experience,
        })),
      }
    })

    return apiResponse(formattedProviders, "Providers retrieved successfully")
  } catch (error) {
    console.error("Error fetching providers:", error)
    return apiResponse(null, "Failed to retrieve providers", 500)
  }
}
