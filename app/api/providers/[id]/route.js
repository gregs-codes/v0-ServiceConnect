import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../../utils/apiResponse"

/**
 * GET method to retrieve a single provider by ID
 */
export async function GET(request, { params }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    // Query the provider with related data
    const { data: provider, error } = await supabaseAdmin
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
        website,
        phone,
        provider_services (
          id,
          category_id,
          service_categories (id, name, description),
          description,
          is_certified,
          certification_details,
          years_experience
        ),
        provider_skills (
          skill_id,
          proficiency_level,
          skills (id, name)
        )
      `)
      .eq("id", id)
      .eq("is_service_provider", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(errorResponse("Provider not found", 404), { status: 404 })
      }
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to retrieve provider", 500), { status: 500 })
    }

    // Get reviews for this provider
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:reviewer_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("reviewee_id", id)
      .order("created_at", { ascending: false })

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError)
      // Continue anyway, we have the main provider data
    }

    // Format the provider data
    const user = provider.users
    const formattedProvider = {
      id: provider.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      avatar: user.avatar_url,
      location: provider.location,
      hourlyRate: provider.hourly_rate,
      rating: provider.average_rating,
      totalReviews: provider.total_reviews,
      bio: provider.bio,
      status: provider.availability_status,
      website: provider.website,
      phone: provider.phone,
      services: (provider.provider_services || []).map((service) => ({
        id: service.id,
        category: {
          id: service.service_categories?.id,
          name: service.service_categories?.name,
          description: service.service_categories?.description,
        },
        description: service.description,
        certified: service.is_certified,
        certificationDetails: service.certification_details,
        yearsExperience: service.years_experience,
      })),
      skills: (provider.provider_skills || []).map((skill) => ({
        id: skill.skills?.id,
        name: skill.skills?.name,
        level: skill.proficiency_level,
      })),
      reviews: (reviews || []).map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        date: review.created_at,
        reviewer: {
          id: review.reviewer?.id,
          name: `${review.reviewer?.first_name || ""} ${review.reviewer?.last_name || ""}`.trim() || "Anonymous",
          avatar: review.reviewer?.avatar_url,
        },
      })),
    }

    return NextResponse.json(successResponse(formattedProvider, "Provider retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Error fetching provider:", error)
    return NextResponse.json(errorResponse("Failed to retrieve provider", 500), { status: 500 })
  }
}

/**
 * PUT method to update a provider by ID
 */
export async function PUT(request, { params }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    const body = await request.json()

    // Check if the provider exists
    const { data: existingProvider, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", id)
      .eq("is_service_provider", true)
      .single()

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(errorResponse("Provider not found", 404), { status: 404 })
      }
      console.error("Database error:", checkError)
      return NextResponse.json(errorResponse("Failed to check provider", 500), { status: 500 })
    }

    // Update user information if provided
    if (body.firstName || body.lastName || body.email || body.avatar) {
      const userUpdates = {}
      if (body.firstName) userUpdates.first_name = body.firstName
      if (body.lastName) userUpdates.last_name = body.lastName
      if (body.email) userUpdates.email = body.email
      if (body.avatar) userUpdates.avatar_url = body.avatar

      const { error: userError } = await supabaseAdmin.from("users").update(userUpdates).eq("id", id)

      if (userError) {
        console.error("Error updating user:", userError)
        return NextResponse.json(errorResponse("Failed to update user information", 500), { status: 500 })
      }
    }

    // Update profile information if provided
    const profileUpdates = {}
    if (body.location) profileUpdates.location = body.location
    if (body.hourlyRate !== undefined) profileUpdates.hourly_rate = body.hourlyRate
    if (body.bio) profileUpdates.bio = body.bio
    if (body.status) profileUpdates.availability_status = body.status
    if (body.website) profileUpdates.website = body.website
    if (body.phone) profileUpdates.phone = body.phone

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabaseAdmin.from("profiles").update(profileUpdates).eq("id", id)

      if (profileError) {
        console.error("Error updating profile:", profileError)
        return NextResponse.json(errorResponse("Failed to update profile information", 500), { status: 500 })
      }
    }

    // Update services if provided
    if (body.services && Array.isArray(body.services)) {
      // First, get existing services
      const { data: existingServices, error: servicesError } = await supabaseAdmin
        .from("provider_services")
        .select("id, category_id")
        .eq("provider_id", id)

      if (servicesError) {
        console.error("Error fetching existing services:", servicesError)
        // Continue anyway
      } else {
        // Process each service
        for (const service of body.services) {
          if (service.id) {
            // Update existing service
            const { error: updateError } = await supabaseAdmin
              .from("provider_services")
              .update({
                description: service.description,
                is_certified: service.certified,
                certification_details: service.certificationDetails,
                years_experience: service.yearsExperience,
              })
              .eq("id", service.id)
              .eq("provider_id", id)

            if (updateError) {
              console.error("Error updating service:", updateError)
            }
          } else if (service.categoryId) {
            // Add new service
            const { error: insertError } = await supabaseAdmin.from("provider_services").insert({
              provider_id: id,
              category_id: service.categoryId,
              description: service.description,
              is_certified: service.certified || false,
              certification_details: service.certificationDetails,
              years_experience: service.yearsExperience || 0,
            })

            if (insertError) {
              console.error("Error adding service:", insertError)
            }
          }
        }
      }
    }

    // Return success
    return NextResponse.json(successResponse(null, "Provider updated successfully"), { status: 200 })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json(errorResponse("Failed to update provider", 500), { status: 500 })
  }
}

/**
 * DELETE method to remove a provider by ID
 */
export async function DELETE(request, { params }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    // Check if the provider exists
    const { data: existingProvider, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", id)
      .eq("is_service_provider", true)
      .single()

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(errorResponse("Provider not found", 404), { status: 404 })
      }
      console.error("Database error:", checkError)
      return NextResponse.json(errorResponse("Failed to check provider", 500), { status: 500 })
    }

    // In a real application, you might want to implement soft delete
    // or check for dependencies before deletion

    // Update the profile to mark as not a service provider
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ is_service_provider: false })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return NextResponse.json(errorResponse("Failed to delete provider", 500), { status: 500 })
    }

    return NextResponse.json(successResponse(null, "Provider deleted successfully"), { status: 200 })
  } catch (error) {
    console.error("Error deleting provider:", error)
    return NextResponse.json(errorResponse("Failed to delete provider", 500), { status: 500 })
  }
}
