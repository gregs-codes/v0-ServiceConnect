"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { useState } from "react"

type Notification = {
  id: string
  type: string
  content: string
  is_read: boolean
  created_at: string
  related_id: string | null
}

interface NotificationListProps {
  notifications: Notification[]
}

export default function NotificationList({ notifications: initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications)

  if (notifications.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No notifications found</p>
      </div>
    )
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, is_read: true } : notification,
          ),
        )
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={`${!notification.is_read ? "border-l-4 border-l-blue-500" : ""}`}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Bell size={16} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{getNotificationTitle(notification.type)}</p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.content}</p>

                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check size={14} className="mr-1" /> Mark as read
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getNotificationTitle(type: string) {
  switch (type) {
    case "project_inquiry":
      return "New Project Inquiry"
    case "project_assigned":
      return "Project Assignment"
    case "new_review":
      return "New Review"
    case "project_bid":
      return "New Project Bid"
    case "message_received":
      return "New Message"
    case "project_opportunity":
      return "Project Opportunity"
    case "project_update":
      return "Project Update"
    default:
      return "Notification"
  }
}
