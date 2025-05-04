import { NextResponse } from "next/server"
import { successResponse, errorResponse } from "../utils/apiResponse"

// Sample bookings array - in a real app, this would be a database
const bookings = [
  {
    id: 1,
    userId: 1,
    providerId: 2,
    serviceType: "Electrical",
    status: "confirmed",
    date: "2023-08-15",
    startTime: "10:00",
    endTime: "12:00",
    totalPrice: 130,
    description: "Install new lighting fixtures in kitchen",
    createdAt: "2023-07-20T14:30:00.000Z",
  },
  {
    id: 2,
    userId: 1,
    providerId: 3,
    serviceType: "Plumbing",
    status: "pending",
    date: "2023-08-20",
    startTime: "14:00",
    endTime: "16:00",
    totalPrice: 140,
    description: "Fix leaking sink and replace faucet",
    createdAt: "2023-07-22T09:15:00.000Z",
  },
]

/**
 * GET method to retrieve all bookings
 * Can filter by userId, providerId, or status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    let filteredBookings = [...bookings]

    // Filter by userId if provided
    const userId = searchParams.get("userId")
    if (userId && !isNaN(Number.parseInt(userId))) {
      filteredBookings = filteredBookings.filter((booking) => booking.userId === Number.parseInt(userId))
    }

    // Filter by providerId if provided
    const providerId = searchParams.get("providerId")
    if (providerId && !isNaN(Number.parseInt(providerId))) {
      filteredBookings = filteredBookings.filter((booking) => booking.providerId === Number.parseInt(providerId))
    }

    // Filter by status if provided
    const status = searchParams.get("status")
    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    return NextResponse.json(successResponse(filteredBookings, "Bookings retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(errorResponse("Failed to retrieve bookings", 500), { status: 500 })
  }
}

/**
 * POST method to create a new booking
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.userId || !body.providerId || !body.date || !body.serviceType) {
      return NextResponse.json(errorResponse("User ID, provider ID, date, and service type are required", 400), {
        status: 400,
      })
    }

    // In a real app, you would validate that the user and provider exist

    const newBooking = {
      id: bookings.length + 1,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...body,
    }

    // In a real app, you would save this to the database

    return NextResponse.json(successResponse(newBooking, "Booking created successfully"), { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(errorResponse("Failed to create booking", 500), { status: 500 })
  }
}
