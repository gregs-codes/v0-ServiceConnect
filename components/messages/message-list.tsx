import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  content: string
  is_read: boolean
  created_at: string
  project_id: string
  sender: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No messages found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Link href={`/messages/${message.project_id}`} key={message.id}>
          <Card
            className={`hover:shadow-md transition-shadow ${!message.is_read ? "border-l-4 border-l-blue-500" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage
                    src={message.sender.avatar_url || ""}
                    alt={`${message.sender.first_name} ${message.sender.last_name}`}
                  />
                  <AvatarFallback>
                    {message.sender.first_name[0]}
                    {message.sender.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {message.sender.first_name} {message.sender.last_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{message.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
