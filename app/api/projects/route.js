import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/auth"

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

// GET method to retrieve projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const providerId = searchParams.get("providerId")
    const status = searchParams.get("status")

    // Start with a base query
    let query = supabaseAdmin.from("projects").select(`
      id,
      title,
      description,
      budget_min,
      budget_max,
      location,
      remote_ok,
      status,
      deadline,
      created_at,
      updated_at,
      client_id,
      service_category_id,
      service_categories (id, name),
      project_assignments (
        id,
        provider_id,
        status,
        start_date,
        end_date,
        profiles (
          id,
          users (id, first_name, last_name, avatar_url),
          hourly_rate,
          average_rating
        )
      )
    `)

    // Apply filters if provided
    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    if (providerId) {
      query = query.filter("project_assignments.provider_id", "eq", providerId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    // Order by creation date, newest first
    query = query.order("created_at", { ascending: false })

    // Execute the query
    const { data: projects, error } = await query

    if (error) {
      console.error("Database error:", error)
      return apiResponse(null, "Failed to retrieve projects", 500)
    }

    // Transform the data to match our API format
    const formattedProjects = projects.map((project) => {
      const category = project.service_categories
      const assignment =
        project.project_assignments && project.project_assignments.length > 0 ? project.project_assignments[0] : null

      let provider = null
      if (assignment && assignment.profiles) {
        const providerUser = assignment.profiles.users
        provider = {
          id: assignment.profiles.id,
          name: `${providerUser.first_name} ${providerUser.last_name}`,
          avatar: providerUser.avatar_url,
          hourlyRate: assignment.profiles.hourly_rate,
          rating: assignment.profiles.average_rating,
        }
      }

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        budgetMin: project.budget_min,
        budgetMax: project.budget_max,
        location: project.location,
        isRemote: project.remote_ok,
        status: project.status,
        deadline: project.deadline,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        clientId: project.client_id,
        category: category
          ? {
              id: category.id,
              name: category.name,
            }
          : null,
        assignment: assignment
          ? {
              id: assignment.id,
              status: assignment.status,
              startDate: assignment.start_date,
              endDate: assignment.end_date,
              provider: provider,
            }
          : null,
      }
    })

    return apiResponse(formattedProjects, "Projects retrieved successfully")
  } catch (error) {
    console.error("Error fetching projects:", error)
    return apiResponse(null, "Failed to retrieve projects", 500)
  }
}

// POST method to create a new project
export async function POST(request) {
  try {
    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return apiResponse(null, "Authentication required", 401)
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return apiResponse(null, "Invalid token", 401)
    }

    const body = await request.json()

    // Basic validation
    if (!body.title || !body.description || !body.categoryId) {
      return apiResponse(null, "Title, description, and category ID are required", 400)
    }

    // Create the new project
    const { data: newProject, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert({
        title: body.title,
        description: body.description,
        budget_min: body.budgetMin || null,
        budget_max: body.budgetMax || null,
        location: body.location || null,
        remote_ok: body.isRemote || false,
        status: "open",
        deadline: body.deadline || null,
        client_id: payload.userId,
        service_category_id: body.categoryId,
      })
      .select()
      .single()

    if (projectError) {
      console.error("Error creating project:", projectError)
      return apiResponse(null, "Failed to create project", 500)
    }

    return apiResponse(
      {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        createdAt: newProject.created_at,
      },
      "Project created successfully",
      201,
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return apiResponse(null, "Failed to create project", 500)
  }
}
