import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../utils/apiResponse"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract filter parameters
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const clientId = searchParams.get("clientId")
    const providerId = searchParams.get("providerId")

    console.log("Fetching projects with filters:", { status, categoryId, clientId, providerId })

    // Start building the query
    let query = supabaseAdmin.from("projects").select(`
      *,
      service_categories(id, name)
    `)

    // Apply filters if provided
    if (status) query = query.eq("status", status)
    if (categoryId) query = query.eq("category_id", categoryId)
    if (clientId) query = query.eq("client_id", clientId)

    // For provider filter, we need to join with project_assignments
    if (providerId) {
      query = supabaseAdmin
        .from("project_assignments")
        .select(`
          project_id,
          projects(
            *,
            service_categories(id, name)
          )
        `)
        .eq("provider_id", providerId)
    }

    // Execute the query
    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to fetch projects", 500, error.message), { status: 500 })
    }

    // Process the data based on whether we used the provider filter
    let projects = []
    if (providerId) {
      // Extract projects from the nested structure
      projects = data.map((assignment) => assignment.projects)
    } else {
      projects = data
    }

    console.log(`Found ${projects?.length || 0} projects`)

    // If no projects found, return mock data
    if (!projects || projects.length === 0) {
      console.log("No projects found, returning mock data")
      const mockProjects = [
        {
          id: "mock-project-1",
          title: "Bathroom Renovation",
          description: "Complete renovation of master bathroom including new fixtures and plumbing.",
          budget: 5000,
          location: "Houston, TX",
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          service_categories: { name: "Plumbing" },
        },
        {
          id: "mock-project-2",
          title: "Kitchen Rewiring",
          description: "Update electrical wiring in kitchen for new appliances.",
          budget: 2500,
          location: "Phoenix, AZ",
          status: "in_progress",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          service_categories: { name: "Electrical" },
        },
      ]

      return NextResponse.json(successResponse(mockProjects, "Mock projects retrieved successfully"), { status: 200 })
    }

    return NextResponse.json(successResponse(projects, "Projects retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(errorResponse("Internal server error", 500, error.message), { status: 500 })
  }
}

export async function POST(request) {
  try {
    const projectData = await request.json()

    console.log("Creating new project:", projectData)

    // Validate required fields
    const requiredFields = ["title", "description", "category_id", "budget", "location", "client_id"]
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(errorResponse(`Missing required field: ${field}`, 400), { status: 400 })
      }
    }

    // Set default values
    const newProject = {
      ...projectData,
      status: projectData.status || "open",
      is_remote: projectData.is_remote || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert the project
    const { data, error } = await supabaseAdmin.from("projects").insert(newProject).select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to create project", 500, error.message), { status: 500 })
    }

    return NextResponse.json(successResponse(data[0], "Project created successfully"), { status: 201 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(errorResponse("Internal server error", 500, error.message), { status: 500 })
  }
}
