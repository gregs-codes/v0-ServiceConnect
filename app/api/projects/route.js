import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../utils/apiResponse"

/**
 * GET method to retrieve all projects
 * Can filter by clientId, status, or category
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Start with a base query
    let query = supabaseAdmin.from("projects").select(`
        id,
        title,
        description,
        budget,
        location,
        is_remote,
        status,
        created_at,
        updated_at,
        completion_date,
        client_id,
        client:client_id (
          users (id, first_name, last_name, avatar_url)
        ),
        category_id,
        category:category_id (
          id, name
        ),
        project_assignments (
          id,
          provider_id,
          status,
          start_date,
          end_date,
          provider:provider_id (
            users (id, first_name, last_name, avatar_url),
            profiles (hourly_rate, average_rating)
          )
        )
      `)

    // Filter by client ID if provided
    const clientId = searchParams.get("clientId")
    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    // Filter by provider ID if provided
    const providerId = searchParams.get("providerId")
    if (providerId) {
      query = query.filter("project_assignments.provider_id", "eq", providerId)
    }

    // Filter by status if provided
    const status = searchParams.get("status")
    if (status) {
      query = query.eq("status", status)
    }

    // Filter by category if provided
    const categoryId = searchParams.get("categoryId")
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // Order by creation date, newest first
    query = query.order("created_at", { ascending: false })

    // Execute the query
    const { data: projects, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to retrieve projects", 500), { status: 500 })
    }

    // Format the response
    const formattedProjects = projects.map((project) => {
      const client = project.client?.users
      const category = project.category
      const assignment =
        project.project_assignments && project.project_assignments.length > 0 ? project.project_assignments[0] : null

      let provider = null
      if (assignment) {
        const providerUser = assignment.provider?.users
        const providerProfile = assignment.provider?.profiles

        if (providerUser) {
          provider = {
            id: providerUser.id,
            name: `${providerUser.first_name} ${providerUser.last_name}`,
            avatar: providerUser.avatar_url,
            hourlyRate: providerProfile?.hourly_rate,
            rating: providerProfile?.average_rating,
          }
        }
      }

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        location: project.location,
        isRemote: project.is_remote,
        status: project.status,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        completionDate: project.completion_date,
        client: client
          ? {
              id: client.id,
              name: `${client.first_name} ${client.last_name}`,
              avatar: client.avatar_url,
            }
          : null,
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

    return NextResponse.json(successResponse(formattedProjects, "Projects retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(errorResponse("Failed to retrieve projects", 500), { status: 500 })
  }
}

/**
 * POST method to create a new project
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.title || !body.clientId || !body.categoryId) {
      return NextResponse.json(errorResponse("Title, client ID, and category ID are required", 400), { status: 400 })
    }

    // Create the new project
    const { data: newProject, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert({
        title: body.title,
        description: body.description || null,
        budget: body.budget || null,
        location: body.location || null,
        is_remote: body.isRemote || false,
        status: "open",
        client_id: body.clientId,
        category_id: body.categoryId,
      })
      .select()
      .single()

    if (projectError) {
      console.error("Error creating project:", projectError)
      return NextResponse.json(errorResponse("Failed to create project", 500), { status: 500 })
    }

    // If provider is specified, create an assignment
    if (body.providerId) {
      const { error: assignmentError } = await supabaseAdmin.from("project_assignments").insert({
        project_id: newProject.id,
        provider_id: body.providerId,
        status: "pending",
      })

      if (assignmentError) {
        console.error("Error creating assignment:", assignmentError)
        // Continue anyway, we've created the main project
      }
    }

    return NextResponse.json(
      successResponse(
        {
          id: newProject.id,
          title: newProject.title,
          description: newProject.description,
          budget: newProject.budget,
          location: newProject.location,
          isRemote: newProject.is_remote,
          status: newProject.status,
          createdAt: newProject.created_at,
        },
        "Project created successfully",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(errorResponse("Failed to create project", 500), { status: 500 })
  }
}
