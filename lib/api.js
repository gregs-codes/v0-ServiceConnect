const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Generic API fetch function
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`

  // Get auth token if available
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    console.log(`Fetching ${url}...`)
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error(`Non-JSON response from ${endpoint}:`, text)
      throw new Error(`Invalid response format from ${endpoint}`)
    }

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data)
      throw new Error(data.message || `API Error (${endpoint}): ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw new Error(`API Error (${endpoint}): ${error.message}`)
  }
}

// Auth functions
export async function loginUser(credentials) {
  try {
    console.log("Logging in user:", credentials.email)
    return await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function registerUser(userData) {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

// Projects functions
export async function getProjects(filters = {}) {
  const queryParams = new URLSearchParams()

  if (filters.status) queryParams.append("status", filters.status)
  if (filters.categoryId) queryParams.append("categoryId", filters.categoryId)
  if (filters.clientId) queryParams.append("clientId", filters.clientId)
  if (filters.providerId) queryParams.append("providerId", filters.providerId)

  const queryString = queryParams.toString()
  const endpoint = `/projects${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint)
}

export async function getProject(id) {
  return fetchAPI(`/projects/${id}`)
}

export async function createProject(projectData) {
  return fetchAPI("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  })
}

// Providers functions
export async function getProviders(filters = {}) {
  const queryParams = new URLSearchParams()

  if (filters.categoryId) queryParams.append("categoryId", filters.categoryId)
  if (filters.location) queryParams.append("location", filters.location)

  const queryString = queryParams.toString()
  const endpoint = `/providers${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint)
}

export async function getProviderById(id) {
  return fetchAPI(`/providers/${id}`)
}

// Categories functions
export async function getServiceCategories() {
  return fetchAPI("/categories")
}

// Messages functions
export async function getUserMessages(userId) {
  return fetchAPI(`/messages?userId=${userId}`)
}

export async function sendMessage(messageData) {
  return fetchAPI("/messages", {
    method: "POST",
    body: JSON.stringify(messageData),
  })
}

// Notifications functions
export async function getUserNotifications(userId) {
  return fetchAPI(`/notifications?userId=${userId}`)
}

export async function markNotificationRead(notificationId) {
  return fetchAPI(`/notifications/${notificationId}/read`, {
    method: "PUT",
  })
}

// User functions
export async function getUserProfile(userId) {
  return fetchAPI(`/users/${userId}`)
}

export async function updateUserProfile(userId, profileData) {
  return fetchAPI(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

// Certifications functions
export async function getUserCertifications(userId) {
  const queryParams = new URLSearchParams()
  queryParams.append("userId", userId)
  return fetchAPI(`/certifications?${queryParams.toString()}`)
}
