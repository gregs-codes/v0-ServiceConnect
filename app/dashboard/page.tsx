import { getCurrentUser, getUserProfile } from "@/utils/auth"
import { createServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ProjectList from "@/components/projects/project-list"
import MessageList from "@/components/messages/message-list"
import NotificationList from "@/components/notifications/notification-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile(user.id)
  const supabase = createServerClient()

  // Fetch projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      service_categories(name, icon)
    `)
    .or(`client_id.eq.${user.id},project_assignments(provider_id.eq.${user.id})`)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id(
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
          <ProjectList projects={projects || []} />

          <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Messages</h2>
          <MessageList messages={messages || []} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <NotificationList notifications={notifications || []} />
        </div>
      </div>
    </div>
  )
}
