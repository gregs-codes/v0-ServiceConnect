"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Calendar, MessageSquare, FileText, Settings, Bell, MapPin, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getProjects } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter()
  const { user, token, isAuthenticated, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch projects on component mount
  useEffect(() => {
    if (isAuthenticated && token && user) {
      const fetchProjects = async () => {
        setLoading(true)
        try {
          const filters = user.isProvider ? { providerId: user.id } : { clientId: user.id }

          const response = await getProjects(filters, token)
          setProjects(response.data || [])
        } catch (err) {
          console.error("Error fetching projects:", err)
          setError("Failed to load projects. Please try again later.")
        } finally {
          setLoading(false)
        }
      }

      fetchProjects()
    }
  }, [isAuthenticated, token, user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-700 text-white p-3 rounded-full mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.isProvider ? "Service Provider" : "Client"}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center p-3 rounded-md ${
                      activeTab === "overview" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full flex items-center p-3 rounded-md ${
                      activeTab === "projects" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    {user?.isProvider ? "My Jobs" : "My Projects"}
                  </button>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`w-full flex items-center p-3 rounded-md ${
                      activeTab === "messages" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Messages
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center p-3 rounded-md ${
                      activeTab === "notifications" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center p-3 rounded-md ${
                      activeTab === "settings" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            {user?.isProvider && (
              <div className="bg-blue-700 text-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-blue-100 mb-4">Get more features and priority placement in search results.</p>
                <button className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors w-full">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">
                        {user?.isProvider ? "Active Jobs" : "Active Projects"}
                      </h3>
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {projects.filter((p) => p.status === "in_progress").length}
                      </span>
                    </div>
                    <div className="text-3xl font-bold">
                      {projects.filter((p) => p.status === "in_progress").length}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Pending</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {projects.filter((p) => p.status === "pending" || p.status === "open").length}
                      </span>
                    </div>
                    <div className="text-3xl font-bold">
                      {projects.filter((p) => p.status === "pending" || p.status === "open").length}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Completed</h3>
                      <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {projects.filter((p) => p.status === "completed").length}
                      </span>
                    </div>
                    <div className="text-3xl font-bold">{projects.filter((p) => p.status === "completed").length}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">{user?.isProvider ? "Recent Jobs" : "Recent Projects"}</h3>
                      <Link href="/dashboard/projects" className="text-blue-700 text-sm hover:text-blue-800">
                        View all
                      </Link>
                    </div>

                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-700"></div>
                      </div>
                    ) : error ? (
                      <p className="text-red-600">{error}</p>
                    ) : projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.slice(0, 3).map((project) => (
                          <div key={project.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{project.title}</h4>
                                <p className="text-gray-600 text-sm">
                                  {user?.isProvider ? project.client?.name : project.category?.name}
                                </p>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                  project.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : project.status === "in_progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {project.status === "in_progress"
                                  ? "In Progress"
                                  : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No {user?.isProvider ? "jobs" : "projects"} found.
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {user?.isProvider ? (
                        <>
                          <Link
                            href="/dashboard/projects"
                            className="block bg-blue-700 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors text-center"
                          >
                            View All Jobs
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="block border border-blue-700 text-blue-700 px-4 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors text-center"
                          >
                            Update Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/projects/new"
                            className="block bg-blue-700 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors text-center flex items-center justify-center"
                          >
                            <Plus className="h-5 w-5 mr-2" /> Post New Project
                          </Link>
                          <Link
                            href="/providers"
                            className="block border border-blue-700 text-blue-700 px-4 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors text-center"
                          >
                            Find Service Providers
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">{user?.isProvider ? "My Jobs" : "My Projects"}</h1>
                  {!user?.isProvider && (
                    <Link
                      href="/projects/new"
                      className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" /> New Project
                    </Link>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
                  </div>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : projects.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="font-bold text-lg">
                        {user?.isProvider ? "Current & Upcoming Jobs" : "Your Projects"}
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {projects.map((project) => (
                        <div key={project.id} className="p-6 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-4 md:mb-0">
                              <h3 className="font-bold text-lg">{project.title}</h3>
                              <p className="text-gray-600">{project.description}</p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {project.location || "Remote"}
                              </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end">
                              <span
                                className={`mb-3 text-sm font-medium px-3 py-1 rounded-full ${
                                  project.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : project.status === "in_progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {project.status === "in_progress"
                                  ? "In Progress"
                                  : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>

                              <div className="flex space-x-2">
                                <Link
                                  href={`/projects/${project.id}`}
                                  className="text-blue-700 hover:text-blue-800 font-medium"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-bold mb-2">No {user?.isProvider ? "jobs" : "projects"} found</h3>
                    <p className="text-gray-600 mb-6">
                      {user?.isProvider
                        ? "You don't have any jobs yet. Update your profile to attract more clients."
                        : "You haven't created any projects yet. Post a new project to find service providers."}
                    </p>
                    {user?.isProvider ? (
                      <Link
                        href="/dashboard/profile"
                        className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                      >
                        Update Profile
                      </Link>
                    ) : (
                      <Link
                        href="/projects/new"
                        className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center inline-flex"
                      >
                        <Plus className="h-5 w-5 mr-2" /> Post New Project
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Messages</h1>
                  <button className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors">
                    New Message
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="mb-4">You don't have any messages yet.</p>
                    <p>Messages from your clients or service providers will appear here.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Notifications</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="mb-4">You don't have any notifications yet.</p>
                    <p>We'll notify you about important updates and activities.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-lg">Profile Information</h2>
                  </div>

                  <div className="p-6">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            defaultValue={user?.firstName || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            defaultValue={user?.lastName || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user?.email || ""}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-lg">Password</h2>
                  </div>

                  <div className="p-6">
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
