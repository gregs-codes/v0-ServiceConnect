import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../utils/apiResponse"

/**
 * GET method to retrieve all service providers
 * Optional query parameters: profession, location, minRating
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Start with a base query for service providers
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

    // Filter by service category if provided
    const category = searchParams.get("category")
    if (category) {
      query = query.filter("provider_services.service_categories.name", "ilike", `%${category}%`)
    }

    // Filter by location if provided
    const location = searchParams.get("location")
    if (location) {
      query = query.filter("location", "ilike", `%${location}%`)
    }

    // Filter by minimum rating if provided
    const minRating = searchParams.get("minRating")
    if (minRating && !isNaN(minRating)) {
      query = query.gte("average_rating", Number.parseFloat(minRating))
    }

    // Execute the query
    const { data: providers, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to retrieve providers", 500), { status: 500 })
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

    return NextResponse.json(successResponse(formattedProviders, "Providers retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json(errorResponse("Failed to retrieve providers", 500), { status: 500 })
  }
}

/**
 * POST method to create a new service provider
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.email || !body.firstName || !body.lastName || !body.location) {
      return NextResponse.json(errorResponse("Email, first name, last name, and location are required", 400), {
        status: 400,
      })
    }

    // Start a transaction
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        avatar_url: body.avatar || null,
      })
      .select("id")
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      return NextResponse.json(errorResponse("Failed to create user account", 500), { status: 500 })
    }

    // Create the provider profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userData.id,
        is_service_provider: true,
        location: body.location,
        hourly_rate: body.hourlyRate || 0,
        bio: body.bio || null,
        availability_status: "available",
      })
      .select()
      .single()

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return NextResponse.json(errorResponse("Failed to create provider profile", 500), { status: 500 })
    }

    // If service categories are provided, add them
    if (body.services && Array.isArray(body.services) && body.services.length > 0) {
      const serviceInserts = body.services.map((service) => ({
        provider_id: userData.id,
        category_id: service.categoryId,
        description: service.description || null,
        is_certified: service.isCertified || false,
        years_experience: service.yearsExperience || 0,
      }))

      const { error: servicesError } = await supabaseAdmin.from("provider_services").insert(serviceInserts)

      if (servicesError) {
        console.error("Error adding services:", servicesError)
        // Continue anyway, we've created the main profile
      }
    }

    // If skills are provided, add them
    if (body.skills && Array.isArray(body.skills) && body.skills.length > 0) {
      const skillInserts = body.skills.map((skill) => ({
        provider_id: userData.id,
        skill_id: skill.id,
        proficiency_level: skill.level || "intermediate",
      }))

      const { error: skillsError } = await supabaseAdmin.from("provider_skills").insert(skillInserts)

      if (skillsError) {
        console.error("Error adding skills:", skillsError)
        // Continue anyway, we've created the main profile
      }
    }

    // Return the created provider
    return NextResponse.json(
      successResponse(
        {
          id: userData.id,
          name: `${body.firstName} ${body.lastName}`,
          email: body.email,
          location: body.location,
          hourlyRate: body.hourlyRate || 0,
          bio: body.bio || null,
        },
        "Provider created successfully",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating provider:", error)
    return NextResponse.json(errorResponse("Failed to create provider", 500), { status: 500 })
  }
}
