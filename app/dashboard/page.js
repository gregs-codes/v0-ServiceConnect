"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProjects, getUserMessages, getUserNotifications } from "@/lib/api"
import ProjectCard from "@/components/project-card"
import MessageList from "@/components/message-list"
import NotificationList from "@/components/notification-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MessageSquare, Briefcase } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("projects")
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // In a real app, this would come from authentication
  // Using one of our seeded users for demonstration
  const userId = "11111111-1111-1111-1111-111111111111"

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)

        // Load data based on active tab to minimize unnecessary API calls
        if (activeTab === "projects") {
          const projectsResponse = await getProjects({ clientId: userId })
          setProjects(projectsResponse.data || [])
        } else if (activeTab === "messages") {
          const messagesResponse = await getUserMessages(userId)
          setMessages(messagesResponse.data || [])
        } else if (activeTab === "notifications") {
          const notificationsResponse = await getUserNotifications(userId)
          setNotifications(notificationsResponse.data || [])
        }

        setError(null)
      } catch (err) {
        console.error(`Error loading ${activeTab}:`, err)
        setError(`Failed to load ${activeTab}. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [activeTab, userId])

  // Count unread messages and notifications
  const unreadMessages = messages.filter((msg) => !msg.isRead && msg.sender.id !== userId).length
  const unreadNotifications = notifications.filter((notif) => !notif.isRead).length

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Dashboard</h1>

        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>My Projects</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{unreadMessages}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{unreadNotifications}</span>
              )}
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>Projects you've created or are working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-4">
                          You haven't created any projects yet or aren't assigned to any.
                        </p>
                        <button
                          onClick={() => router.push("/projects/create")}
                          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                        >
                          Create a Project
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Your conversations with service providers and clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageList messages={messages} currentUserId={userId} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated on your projects and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationList
                      notifications={notifications}
                      onMarkAsRead={(id) => {
                        // Update local state immediately for better UX
                        setNotifications((prev) =>
                          prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)),
                        )
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  )
}
