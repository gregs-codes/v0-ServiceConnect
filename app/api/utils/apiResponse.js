/**
 * Standard success response format
 * @param {any} data - The data to return
 * @param {string} message - Success message
 * @returns {Object} Formatted success response
 */
export function successResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data,
  }
}

/**
 * Standard error response format
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (must be between 200-599)
 * @param {string} details - Detailed error information
 * @returns {Object} Formatted error response
 */
export function errorResponse(message = "An error occurred", status = 500, details = null) {
  // Ensure status is a valid HTTP status code
  if (status < 200 || status > 599) {
    console.warn(`Invalid status code ${status} provided, defaulting to 500`)
    status = 500
  }

  return {
    success: false,
    message,
    status,
    details,
  }
}
