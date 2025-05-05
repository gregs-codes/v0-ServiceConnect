import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../../utils/apiResponse"

/**
 * GET method to retrieve a single provider by ID
 */
export async function GET(request, { params }) {
  try {
    const id = params.id
    console.log("Fetching provider with ID:", id)

    if (!id) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    // Check if this is a mock provider request
    if (id.startsWith("mock-provider")) {
      console.log("Returning mock provider data")
      return NextResponse.json(
        successResponse(
          {
            id: id,
            name: "John Mock Provider",
            email: "john.mock@example.com",
            avatar: "/diverse-group.png",
            location: "Mock City, State",
            hourlyRate: 75,
            rating: 4.8,
            totalReviews: 24,
            bio: "This is a mock provider for testing purposes. In a real application, this would contain the provider's biography and professional information.",
            status: "available",
            website: "https://example.com",
            phone: "(555) 123-4567",
            services: [
              {
                id: "mock-service-1",
                category: {
                  id: "mock-category-1",
                  name: "Plumbing",
                  description: "Plumbing services",
                },
                description:
                  "Expert plumbing services including leak repairs, pipe installation, and fixture replacement.",
                certified: true,
                certificationDetails: "Licensed Master Plumber",
                yearsExperience: 10,
              },
              {
                id: "mock-service-2",
                category: {
                  id: "mock-category-2",
                  name: "Electrical",
                  description: "Electrical services",
                },
                description: "Professional electrical services for residential and commercial properties.",
                certified: true,
                certificationDetails: "Certified Electrician",
                yearsExperience: 8,
              },
            ],
            skills: [
              { id: "skill-1", name: "Pipe Fitting", level: "Expert" },
              { id: "skill-2", name: "Fixture Installation", level: "Expert" },
              { id: "skill-3", name: "Leak Detection", level: "Advanced" },
            ],
            reviews: [
              {
                id: "review-1",
                rating: 5,
                comment: "Excellent service! Fixed my leaky pipe quickly and professionally.",
                date: "2023-05-15T14:30:00Z",
                reviewer: {
                  id: "reviewer-1",
                  name: "Jane Smith",
                  avatar: "/diverse-woman-portrait.png",
                },
              },
              {
                id: "review-2",
                rating: 4,
                comment: "Good work, arrived on time and completed the job as expected.",
                date: "2023-04-22T10:15:00Z",
                reviewer: {
                  id: "reviewer-2",
                  name: "Bob Johnson",
                  avatar: "/thoughtful-man.png",
                },
              },
            ],
            verified: true,
          },
          "Provider retrieved successfully",
        ),
        { status: 200 },
      )
    }

    // Step 1: Get the profile
    console.log("Step 1: Fetching profile data")
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, location, hourly_rate, average_rating, total_reviews, bio, availability_status, website, phone")
      .eq("id", id)
      .eq("is_service_provider", true)
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
      if (profileError.code === "PGRST116") {
        return NextResponse.json(errorResponse("Provider not found", 404), { status: 404 })
      }
      return NextResponse.json(errorResponse("Failed to retrieve provider profile", 500), { status: 500 })
    }

    // Step 2: Get the user data
    console.log("Step 2: Fetching user data")
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, first_name, last_name, email, avatar_url")
      .eq("id", id)
      .single()

    if (userError) {
      console.error("User error:", userError)
      // Continue anyway, we have the profile data
    }

    // Step 3: Get provider services
    console.log("Step 3: Fetching provider services")
    const { data: services, error: servicesError } = await supabaseAdmin
      .from("provider_services")
      .select("id, category_id, description, is_certified, certification_details, years_experience")
      .eq("provider_id", id)

    if (servicesError) {
      console.error("Services error:", servicesError)
      // Continue anyway
    }

    // Step 4: Get categories for the services
    const categoryIds = services ? services.map((service) => service.category_id).filter(Boolean) : []
    let categories = []

    if (categoryIds.length > 0) {
      console.log("Step 4: Fetching categories")
      const { data: categoriesData, error: categoriesError } = await supabaseAdmin
        .from("service_categories")
        .select("id, name, description")
        .in("id", categoryIds)

      if (categoriesError) {
        console.error("Categories error:", categoriesError)
      } else {
        categories = categoriesData || []
      }
    }

    // Step 5: Get provider skills
    console.log("Step 5: Fetching provider skills")
    const { data: skills, error: skillsError } = await supabaseAdmin
      .from("provider_skills")
      .select("skill_id, proficiency_level")
      .eq("provider_id", id)

    if (skillsError) {
      console.error("Skills error:", skillsError)
      // Continue anyway
    }

    // Step 6: Get skill details
    const skillIds = skills ? skills.map((skill) => skill.skill_id).filter(Boolean) : []
    let skillDetails = []

    if (skillIds.length > 0) {
      console.log("Step 6: Fetching skill details")
      const { data: skillsData, error: skillDetailsError } = await supabaseAdmin
        .from("skills")
        .select("id, name")
        .in("id", skillIds)

      if (skillDetailsError) {
        console.error("Skill details error:", skillDetailsError)
      } else {
        skillDetails = skillsData || []
      }
    }

    // Step 7: Get reviews
    console.log("Step 7: Fetching reviews")
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer_id")
      .eq("reviewee_id", id)
      .order("created_at", { ascending: false })

    if (reviewsError) {
      console.error("Reviews error:", reviewsError)
      // Continue anyway
    }

    // Step 8: Get reviewer details
    const reviewerIds = reviews ? reviews.map((review) => review.reviewer_id).filter(Boolean) : []
    let reviewers = []

    if (reviewerIds.length > 0) {
      console.log("Step 8: Fetching reviewer details")
      const { data: reviewersData, error: reviewersError } = await supabaseAdmin
        .from("users")
        .select("id, first_name, last_name, avatar_url")
        .in("id", reviewerIds)

      if (reviewersError) {
        console.error("Reviewers error:", reviewersError)
      } else {
        reviewers = reviewersData || []
      }
    }

    // Step 9: Combine all the data
    console.log("Step 9: Combining data")

    // Map services with their categories
    const servicesWithCategories = (services || []).map((service) => {
      const category = categories.find((cat) => cat.id === service.category_id) || null
      return {
        id: service.id,
        category: category
          ? {
              id: category.id,
              name: category.name,
              description: category.description,
            }
          : null,
        description: service.description,
        certified: service.is_certified,
        certificationDetails: service.certification_details,
        yearsExperience: service.years_experience,
      }
    })

    // Map skills with their details
    const skillsWithDetails = (skills || []).map((skill) => {
      const detail = skillDetails.find((s) => s.id === skill.skill_id) || null
      return {
        id: skill.skill_id,
        name: detail ? detail.name : "Unknown Skill",
        level: skill.proficiency_level,
      }
    })

    // Map reviews with reviewer details
    const reviewsWithDetails = (reviews || []).map((review) => {
      const reviewer = reviewers.find((r) => r.id === review.reviewer_id) || null
      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        date: review.created_at,
        reviewer: reviewer
          ? {
              id: reviewer.id,
              name: `${reviewer.first_name || ""} ${reviewer.last_name || ""}`.trim() || "Anonymous",
              avatar: reviewer.avatar_url,
            }
          : {
              id: null,
              name: "Anonymous",
              avatar: null,
            },
      }
    })

    // Format the provider data
    const formattedProvider = {
      id: profile.id,
      name: user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Unknown Provider",
      email: user ? user.email : null,
      avatar: user ? user.avatar_url : null,
      location: profile.location,
      hourlyRate: profile.hourly_rate,
      rating: profile.average_rating,
      totalReviews: profile.total_reviews,
      bio: profile.bio,
      status: profile.availability_status,
      website: profile.website,
      phone: profile.phone,
      services: servicesWithCategories,
      skills: skillsWithDetails,
      reviews: reviewsWithDetails,
      verified: true, // Assuming all providers in the database are verified
    }

    console.log("Provider data prepared successfully")
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
