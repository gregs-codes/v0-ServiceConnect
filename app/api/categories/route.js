import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock categories data
    const categories = [
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical" },
      { id: "carpentry", name: "Carpentry" },
      { id: "painting", name: "Painting" },
      { id: "landscaping", name: "Landscaping" },
      { id: "cleaning", name: "Cleaning" },
      { id: "hvac", name: "HVAC" },
      { id: "roofing", name: "Roofing" },
      { id: "flooring", name: "Flooring" },
      { id: "general", name: "General Contracting" },
    ]

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch categories" },
      { status: 500 },
    )
  }
}
