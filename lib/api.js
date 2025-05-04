/**
 * Utility functions for making API requests
 */

// Base URL for API requests
const API_BASE_URL = "/api"

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/providers')
 * @param {Object} options - Fetch options
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - API response
 */
export async function fetchAPI(endpoint, options = {}, token = null) {
  const url = `${API_BASE_URL}${endpoint}`

  // Set up headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Parse the response
  const data = await response.json()

  // Handle error responses
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

/**
 * Get all service providers with optional filters
 * @param {Object} filters - Optional filters (category, location, minRating)
 * @returns {Promise<Object>} - API response
 */
export async function getProviders(filters = {}) {
  // Build query string from filters
  const queryParams = new URLSearchParams()

  if (filters.category) queryParams.append("category", filters.category)
  if (filters.location) queryParams.append("location", filters.location)
  if (filters.minRating) queryParams.append("minRating", filters.minRating)

  const queryString = queryParams.toString()
  const endpoint = `/providers${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint)
}

/**
 * Get a single provider by ID
 * @param {string} id - Provider ID
 * @returns {Promise<Object>} - API response
 */
export async function getProvider(id) {
  return fetchAPI(`/providers/${id}`)
}

/**
 * Get all service categories
 * @returns {Promise<Object>} - API response
 */
export async function getServiceCategories() {
  return fetchAPI("/services")
}

/**
 * Get all projects/jobs with optional filters
 * @param {Object} filters - Optional filters (clientId, providerId, status, categoryId)
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - API response
 */
export async function getProjects(filters = {}, token) {
  // Build query string from filters
  const queryParams = new URLSearchParams()

  if (filters.clientId) queryParams.append("clientId", filters.clientId)
  if (filters.providerId) queryParams.append("providerId", filters.providerId)
  if (filters.status) queryParams.append("status", filters.status)
  if (filters.categoryId) queryParams.append("categoryId", filters.categoryId)

  const queryString = queryParams.toString()
  const endpoint = `/projects${queryString ? `?${queryString}` : ""}`

  return fetchAPI(endpoint, {}, token)
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - API response
 */
export async function createProject(projectData, token) {
  return fetchAPI(
    "/projects",
    {
      method: "POST",
      body: JSON.stringify(projectData),
    },
    token,
  )
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - API response
 */
export async function registerUser(userData) {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - API response
 */
export async function loginUser(credentials) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}
