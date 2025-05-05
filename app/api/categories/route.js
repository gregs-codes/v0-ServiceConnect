import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "../utils/apiResponse"

export async function GET() {
  try {
    console.log("Fetching service categories")

    const { data, error } = await supabaseAdmin.from("service_categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json(errorResponse("Failed to fetch categories", 500, error.message), { status: 500 })
    }

    console.log(`Found ${data?.length || 0} categories`)

    // If no categories found, return mock data
    if (!data || data.length === 0) {
      console.log("No categories found, returning mock data")
      const mockData = [
        { id: "mock-category-1", name: "Plumbing" },
        { id: "mock-category-2", name: "Electrical" },
        { id: "mock-category-3", name: "Carpentry" },
        { id: "mock-category-4", name: "Painting" },
        { id: "mock-category-5", name: "HVAC" },
      ]
      return NextResponse.json(successResponse(mockData, "Mock categories retrieved successfully"), { status: 200 })
    }

    return NextResponse.json(successResponse(data, "Categories retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(errorResponse("Internal server error", 500, error.message), { status: 500 })
  }
}
