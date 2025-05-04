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

// GET method to retrieve messages
export async function GET(request) {
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

    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get("recipientId")
    const projectId = searchParams.get("projectId")

    if (!recipientId && !projectId) {
      return apiResponse(null, "Either recipientId or projectId is required", 400)
    }

    // Start with a base query
    let query = supabaseAdmin
      .from("messages")
      .select(`
        id,
        content,
        is_read,
        created_at,
        sender_id,
        sender:sender_id (
          users (id, first_name, last_name, avatar_url)
        ),
        recipient_id,
        recipient:recipient_id (
          users (id, first_name, last_name, avatar_url)
        ),
        project_id
      `)
      .or(`sender_id.eq.${payload.userId},recipient_id.eq.${payload.userId}`)

    // Apply filters if provided
    if (recipientId) {
      query = query.or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    }

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    // Order by creation date
    query = query.order("created_at", { ascending: true })

    // Execute the query
    const { data: messages, error } = await query

    if (error) {
      console.error("Database error:", error)
      return apiResponse(null, "Failed to retrieve messages", 500)
    }

    // Transform the data to match our API format
    const formattedMessages = messages.map((message) => {
      const senderUser = message.sender?.users
      const recipientUser = message.recipient?.users

      return {
        id: message.id,
        content: message.content,
        isRead: message.is_read,
        createdAt: message.created_at,
        sender: senderUser
          ? {
              id: senderUser.id,
              name: `${senderUser.first_name} ${senderUser.last_name}`,
              avatar: senderUser.avatar_url,
            }
          : null,
        recipient: recipientUser
          ? {
              id: recipientUser.id,
              name: `${recipientUser.first_name} ${recipientUser.last_name}`,
              avatar: recipientUser.avatar_url,
            }
          : null,
        projectId: message.project_id,
      }
    })

    return apiResponse(formattedMessages, "Messages retrieved successfully")
  } catch (error) {
    console.error("Error fetching messages:", error)
    return apiResponse(null, "Failed to retrieve messages", 500)
  }
}

// POST method to send a new message
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
    if (!body.content || !body.recipientId) {
      return apiResponse(null, "Content and recipient ID are required", 400)
    }

    // Create the new message
    const { data: newMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .insert({
        content: body.content,
        sender_id: payload.userId,
        recipient_id: body.recipientId,
        project_id: body.projectId || null,
        is_read: false,
      })
      .select()
      .single()

    if (messageError) {
      console.error("Error creating message:", messageError)
      return apiResponse(null, "Failed to send message", 500)
    }

    return apiResponse(
      {
        id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.created_at,
      },
      "Message sent successfully",
      201,
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return apiResponse(null, "Failed to send message", 500)
  }
}
