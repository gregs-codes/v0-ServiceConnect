import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../utils/apiResponse"

/**
 * GET method to retrieve all service categories
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Query service categories
    let query = supabaseAdmin.from("service_categories").select("id, name, description, icon, created_at")

    // Filter by name if provided
    const name = searchParams.get("name")
    if (name) {
      query = query.ilike("name", `%${name}%`)
    }

    // Execute the query
    const { data: categories, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(errorResponse("Failed to retrieve service categories", 500), { status: 500 })
    }

    // Get skills for each category
    const { data: skills, error: skillsError } = await supabaseAdmin.from("skills").select("id, name, category_id")

    if (skillsError) {
      console.error("Error fetching skills:", skillsError)
      // Continue anyway, we have the main categories
    }

    // Group skills by category
    const skillsByCategory = {}
    if (skills) {
      skills.forEach((skill) => {
        if (!skillsByCategory[skill.category_id]) {
          skillsByCategory[skill.category_id] = []
        }
        skillsByCategory[skill.category_id].push({
          id: skill.id,
          name: skill.name,
        })
      })
    }

    // Format the response
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      skills: skillsByCategory[category.id] || [],
    }))

    return NextResponse.json(successResponse(formattedCategories, "Service categories retrieved successfully"), {
      status: 200,
    })
  } catch (error) {
    console.error("Error fetching service categories:", error)
    return NextResponse.json(errorResponse("Failed to retrieve service categories", 500), { status: 500 })
  }
}

/**
 * POST method to create a new service category
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name) {
      return NextResponse.json(errorResponse("Name is required", 400), { status: 400 })
    }

    // Check if category already exists
    const { data: existingCategory, error: checkError } = await supabaseAdmin
      .from("service_categories")
      .select("id")
      .ilike("name", body.name)

    if (checkError) {
      console.error("Error checking existing category:", checkError)
      return NextResponse.json(errorResponse("Failed to check for existing category", 500), { status: 500 })
    }

    if (existingCategory && existingCategory.length > 0) {
      return NextResponse.json(errorResponse("A service category with this name already exists", 409), { status: 409 })
    }

    // Create the new category
    const { data: newCategory, error: insertError } = await supabaseAdmin
      .from("service_categories")
      .insert({
        name: body.name,
        description: body.description || null,
        icon: body.icon || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating category:", insertError)
      return NextResponse.json(errorResponse("Failed to create service category", 500), { status: 500 })
    }

    // If skills are provided, add them
    if (body.skills && Array.isArray(body.skills) && body.skills.length > 0) {
      const skillInserts = body.skills.map((skill) => ({
        name: skill,
        category_id: newCategory.id,
      }))

      const { error: skillsError } = await supabaseAdmin.from("skills").insert(skillInserts)

      if (skillsError) {
        console.error("Error adding skills:", skillsError)
        // Continue anyway, we've created the main category
      }
    }

    return NextResponse.json(
      successResponse(
        {
          id: newCategory.id,
          name: newCategory.name,
          description: newCategory.description,
          icon: newCategory.icon,
          skills: body.skills ? body.skills.map((skill) => ({ name: skill })) : [],
        },
        "Service category created successfully",
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service category:", error)
    return NextResponse.json(errorResponse("Failed to create service category", 500), { status: 500 })
  }
}
