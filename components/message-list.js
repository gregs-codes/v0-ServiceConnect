"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { getMessages, sendMessage } from "@/lib/api"

export default function MessageList({ recipientId, projectId }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Load messages
  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (recipientId) params.append("recipientId", recipientId)
        if (projectId) params.append("projectId", projectId)

        const response = await getMessages(params.toString())
        setMessages(response.data || [])
        setError(null)
      } catch (err) {
        console.error("Error loading messages:", err)
        setError("Failed to load messages. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
    // Set up polling for new messages
    const interval = setInterval(loadMessages, 10000)
    return () => clearInterval(interval)
  }, [recipientId, projectId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setSending(true)
      const messageData = {
        content: newMessage,
        recipientId,
        projectId,
      }

      const response = await sendMessage(messageData)
      setMessages([...messages, response.data])
      setNewMessage("")
      setError(null)
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender?.id === recipientId ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender?.id === recipientId ? "bg-gray-100 text-gray-800" : "bg-blue-700 text-white"
                }`}
              >
                <div className="text-sm mb-1">{message.content}</div>
                <div className={`text-xs ${message.sender?.id === recipientId ? "text-gray-500" : "text-blue-200"}`}>
                  {formatDate(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-r-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
