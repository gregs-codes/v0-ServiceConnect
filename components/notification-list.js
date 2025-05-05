"use client"

import { formatDistanceToNow } from "date-fns"
import { markNotificationRead } from "@/lib/api"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationList({ notifications, onMarkAsRead }) {
  // Handle marking a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id)
      if (onMarkAsRead) {
        onMarkAsRead(id)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "project_inquiry":
      case "project_assigned":
      case "project_bid":
        return <Bell className="h-5 w-5 text-blue-600" />
      case "message_received":
        return <Bell className="h-5 w-5 text-green-600" />
      case "new_review":
        return <Bell className="h-5 w-5 text-yellow-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">No notifications</h3>
        <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-4 p-4 rounded-lg ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
        >
          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

          <div className="flex-1">
            <p className="text-gray-800">{notification.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>

          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsRead(notification.id)}
              className="flex-shrink-0"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
