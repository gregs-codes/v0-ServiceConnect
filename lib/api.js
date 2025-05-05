const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Generic API fetch function
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error (${endpoint}): ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw new Error(`API Error (${endpoint}): ${error.message}`)
  }
}

// Auth functions
export async function loginUser(credentials) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
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
