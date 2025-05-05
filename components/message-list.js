"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage } from "@/lib/api"
import { MessageSquare, Send } from "lucide-react"

export default function MessageList({ messages, currentUserId }) {
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [sending, setSending] = useState(false)

  // Group messages by conversation (same sender/recipient pair)
  const conversations = messages.reduce((acc, message) => {
    // Determine the other person in the conversation
    const otherPersonId = message.sender.id === currentUserId ? message.recipient.id : message.sender.id

    const otherPerson = message.sender.id === currentUserId ? message.recipient : message.sender

    if (!acc[otherPersonId]) {
      acc[otherPersonId] = {
        person: otherPerson,
        messages: [],
        lastMessage: null,
        unreadCount: 0,
        projectId: message.project?.id,
      }
    }

    acc[otherPersonId].messages.push(message)

    // Track the most recent message
    if (
      !acc[otherPersonId].lastMessage ||
      new Date(message.createdAt) > new Date(acc[otherPersonId].lastMessage.createdAt)
    ) {
      acc[otherPersonId].lastMessage = message
    }

    // Count unread messages
    if (!message.isRead && message.sender.id !== currentUserId) {
      acc[otherPersonId].unreadCount++
    }

    return acc
  }, {})

  // Convert to array and sort by most recent message
  const sortedConversations = Object.values(conversations).sort((a, b) => {
    return new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
  })

  // Handle sending a reply
  const handleSendReply = async () => {
    if (!replyTo || !replyContent.trim()) return

    try {
      setSending(true)

      await sendMessage({
        senderId: currentUserId,
        recipientId: replyTo.id,
        content: replyContent,
        projectId: replyTo.projectId,
      })

      // Clear the form
      setReplyContent("")
      setReplyTo(null)

      // In a real app, you would refresh the messages or add the new message to the list
      // For this demo, we'll just show a success message
      alert("Message sent successfully!")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">No messages yet</h3>
        <p className="text-gray-600">When you receive messages, they will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedConversations.map((conversation) => {
        const { person, lastMessage, unreadCount } = conversation

        return (
          <div
            key={person.id}
            className={`flex items-start gap-4 p-4 rounded-lg ${
              unreadCount > 0 ? "bg-blue-50" : "bg-white"
            } hover:bg-gray-50 cursor-pointer transition-colors`}
            onClick={() => setReplyTo(person)}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
              <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium truncate">{person.name}</h4>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-gray-600 truncate">
                {lastMessage.sender.id === currentUserId ? "You: " : ""}
                {lastMessage.content}
              </p>

              {lastMessage.project && <p className="text-xs text-gray-500 mt-1">Re: {lastMessage.project.title}</p>}
            </div>

            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
            )}
          </div>
        )
      })}

      {replyTo && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Reply to {replyTo.name}</span>
            <button onClick={() => setReplyTo(null)} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>

          <div className="flex gap-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendReply} disabled={!replyContent.trim() || sending} className="self-end">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
