"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for dashboard
  const upcomingProjects = [
    {
      id: 1,
      title: "Industrial Pipe Welding",
      client: "ABC Manufacturing",
      date: "May 15, 2023",
      status: "confirmed",
      location: "Phoenix, AZ",
    },
    {
      id: 2,
      title: "Custom Metal Staircase",
      client: "Johnson Residence",
      date: "May 22, 2023",
      status: "pending",
      location: "Scottsdale, AZ",
    },
    {
      id: 3,
      title: "Aluminum Fence Repair",
      client: "City Park Department",
      date: "June 3, 2023",
      status: "confirmed",
      location: "Tempe, AZ",
    },
  ]

  const recentMessages = [
    {
      id: 1,
      from: "John Smith",
      subject: "Project Details",
      preview: "I wanted to discuss the specifics of the welding project we talked about...",
      date: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      from: "Sarah Johnson",
      subject: "Quote Request",
      preview: "Could you provide a quote for welding services for our upcoming construction project?",
      date: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      from: "Michael Brown",
      subject: "Follow-up",
      preview: "Thank you for completing the project. I wanted to follow up on the final inspection...",
      date: "3 days ago",
      unread: false,
    },
  ]

  const notifications = [
    {
      id: 1,
      message: "New project request from ABC Manufacturing",
      time: "1 hour ago",
      type: "request",
    },
    {
      id: 2,
      message: "Your quote for Johnson Residence was accepted",
      time: "Yesterday",
      type: "success",
    },
    {
      id: 3,
      message: "Payment received for City Park Department project",
      time: "2 days ago",
      type: "payment",
    },
  ]

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
                  <h2 className="text-xl font-bold">David Wilson</h2>
                  <p className="text-gray-600">Welder Professional</p>
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
                    Projects
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

            <div className="bg-blue-700 text-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-blue-100 mb-4">Get more features and priority placement in search results.</p>
              <button className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors w-full">
                Upgrade Now
              </button>
            </div>
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
                      <h3 className="font-bold text-gray-700">Upcoming Projects</h3>
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {upcomingProjects.length}
                      </span>
                    </div>
                    <div className="text-3xl font-bold">{upcomingProjects.length}</div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Unread Messages</h3>
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {recentMessages.filter((msg) => msg.unread).length}
                      </span>
                    </div>
                    <div className="text-3xl font-bold">{recentMessages.filter((msg) => msg.unread).length}</div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Profile Views</h3>
                      <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        +12%
                      </span>
                    </div>
                    <div className="text-3xl font-bold">48</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Upcoming Projects</h3>
                      <Link href="/dashboard/projects" className="text-blue-700 text-sm hover:text-blue-800">
                        View all
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {upcomingProjects.slice(0, 2).map((project) => (
                        <div key={project.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-gray-600 text-sm">{project.client}</p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {project.date}
                              </div>
                            </div>
                            <span
                              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                project.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {project.status === "confirmed" ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Recent Messages</h3>
                      <Link href="/dashboard/messages" className="text-blue-700 text-sm hover:text-blue-800">
                        View all
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {recentMessages.slice(0, 2).map((message) => (
                        <div key={message.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{message.from}</h4>
                                {message.unread && (
                                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{message.subject}</p>
                              <p className="text-gray-500 text-sm mt-1 line-clamp-1">{message.preview}</p>
                            </div>
                            <span className="text-xs text-gray-500">{message.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Projects</h1>
                  <button className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors">
                    Add New Project
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="font-bold text-lg">Upcoming Projects</h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {upcomingProjects.map((project) => (
                      <div key={project.id} className="p-6 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <p className="text-gray-600">{project.client}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {project.date}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {project.location}
                            </div>
                          </div>

                          <div className="flex flex-col items-start md:items-end">
                            <span
                              className={`mb-3 text-sm font-medium px-3 py-1 rounded-full ${
                                project.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {project.status === "confirmed" ? (
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" /> Pending
                                </span>
                              )}
                            </span>

                            <div className="flex space-x-2">
                              <button className="text-blue-700 hover:text-blue-800 font-medium">View Details</button>
                              <button className="text-gray-600 hover:text-gray-800 font-medium">Edit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <div className="divide-y divide-gray-200">
                    {recentMessages.map((message) => (
                      <div key={message.id} className={`p-6 hover:bg-gray-50 ${message.unread ? "bg-blue-50" : ""}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-bold text-lg">{message.from}</h3>
                              {message.unread && (
                                <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 font-medium">{message.subject}</p>
                            <p className="text-gray-600 mt-1">{message.preview}</p>
                            <p className="text-gray-500 text-sm mt-2">{message.date}</p>
                          </div>

                          <div className="flex space-x-2">
                            <button className="text-blue-700 hover:text-blue-800 font-medium">Reply</button>
                            <button className="text-gray-600 hover:text-gray-800 font-medium">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Notifications</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="mr-4">
                            {notification.type === "request" && (
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Bell className="h-6 w-6 text-blue-700" />
                              </div>
                            )}
                            {notification.type === "success" && (
                              <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-700" />
                              </div>
                            )}
                            {notification.type === "payment" && (
                              <div className="bg-purple-100 p-2 rounded-full">
                                <DollarSign className="h-6 w-6 text-purple-700" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                            defaultValue="David"
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
                            defaultValue="Wilson"
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
                          defaultValue="david.wilson@example.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          defaultValue="(555) 123-4567"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          defaultValue="Phoenix, AZ"
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
