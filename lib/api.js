// API utility functions

// Base API URL
const API_BASE_URL = "/api"

// Generic fetch function with error handling
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization header if token exists
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  if (token && !endpoint.startsWith("/auth/")) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Merge options
  const fetchOptions = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, fetchOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Auth API functions
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

// Providers API functions
export async function getProviders(filters = {}) {
  const queryParams = new URLSearchParams()

  if (filters.serviceType) {
    queryParams.append("serviceType", filters.serviceType)
  }

  if (filters.location) {
    queryParams.append("location", filters.location)
  }

  const queryString = queryParams.toString()
  const endpoint = `/providers${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint)
}

export async function getProviderById(id) {
  return fetchAPI(`/providers/${id}`)
}

// Services API functions
export async function getServiceCategories() {
  return fetchAPI("/services")
}

// Projects API functions
export async function getProjects(filters = {}) {
  const queryParams = new URLSearchParams()

  if (filters.clientId) {
    queryParams.append("clientId", filters.clientId)
  }

  if (filters.providerId) {
    queryParams.append("providerId", filters.providerId)
  }

  const queryString = queryParams.toString()
  const endpoint = `/projects${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint)
}

export async function createProject(projectData) {
  return fetchAPI("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  })
}

// Messages API functions
export async function getMessages(conversationId) {
  return fetchAPI(`/messages?conversationId=${conversationId}`)
}

export async function sendMessage(messageData) {
  return fetchAPI("/messages", {
    method: "POST",
    body: JSON.stringify(messageData),
  })
}

// Reviews API functions
export async function getReviews(providerId) {
  return fetchAPI(`/reviews?providerId=${providerId}`)
}

export async function createReview(reviewData) {
  return fetchAPI("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  })
}

// Profile API functions
export async function getUserProfile() {
  return fetchAPI("/user/profile")
}

export async function updateUserProfile(profileData) {
  return fetchAPI("/user/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

// Certifications API functions
export async function getCertifications(profileId) {
  return fetchAPI(`/certifications?profileId=${profileId}`)
}

export async function addCertification(certificationData) {
  return fetchAPI("/certifications", {
    method: "POST",
    body: JSON.stringify(certificationData),
  })
}
