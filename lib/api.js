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

    // Check if the response has content
    const contentType = response.headers.get("content-type")

    // Handle empty responses
    if (!contentType) {
      const text = await response.text()
      console.error(`Empty or invalid response from ${endpoint}:`, text)

      if (!response.ok) {
        throw new Error(`API Error (${endpoint}): ${response.status} ${response.statusText}`)
      }

      // Return a default success response for empty but successful responses
      return { success: true, data: {} }
    }

    // Handle JSON responses
    if (contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        console.error(`API Error (${endpoint}):`, data)
        throw new Error(data.message || `API Error (${endpoint}): ${response.statusText}`)
      }

      return data
    }

    // Handle non-JSON responses
    const text = await response.text()
    console.error(`Non-JSON response from ${endpoint}:`, text)

    if (!response.ok) {
      throw new Error(`API Error (${endpoint}): ${response.status} ${response.statusText}`)
    }

    // Try to parse the text as JSON as a last resort
    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error(`Invalid response format from ${endpoint}: ${text.substring(0, 100)}...`)
    }
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
  try {
    console.log("Registering user:", userData.email)
    return await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Rest of the file remains unchanged
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
