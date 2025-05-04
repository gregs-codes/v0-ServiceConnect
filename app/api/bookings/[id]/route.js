import { NextResponse } from "next/server"
import { successResponse, errorResponse } from "../../utils/apiResponse"

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
 * GET method to retrieve a booking by ID
 */
export async function GET(request, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    const booking = bookings.find((b) => b.id === id)

    if (!booking) {
      return NextResponse.json(errorResponse("Booking not found", 404), { status: 404 })
    }

    return NextResponse.json(successResponse(booking, "Booking retrieved successfully"), { status: 200 })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(errorResponse("Failed to retrieve booking", 500), { status: 500 })
  }
}

/**
 * PUT method to update a booking by ID
 */
export async function PUT(request, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    const bookingIndex = bookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(errorResponse("Booking not found", 404), { status: 404 })
    }

    const body = await request.json()

    // In a real app, you would update the database
    // Here we just return what the updated booking would look like
    const updatedBooking = {
      ...bookings[bookingIndex],
      ...body,
      id, // Ensure ID remains the same
    }

    return NextResponse.json(successResponse(updatedBooking, "Booking updated successfully"), { status: 200 })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(errorResponse("Failed to update booking", 500), { status: 500 })
  }
}

/**
 * DELETE method to cancel a booking by ID
 */
export async function DELETE(request, { params }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(errorResponse("Invalid ID format", 400), { status: 400 })
    }

    const bookingIndex = bookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(errorResponse("Booking not found", 404), { status: 404 })
    }

    // In a real app, you would update the database
    // Here we just simulate a successful delete operation
    return NextResponse.json(successResponse(null, "Booking cancelled successfully"), { status: 200 })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(errorResponse("Failed to cancel booking", 500), { status: 500 })
  }
}
