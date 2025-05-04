/**
 * Utility functions for consistent API responses
 */

export function successResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(message = "An error occurred", statusCode = 400) {
  return {
    success: false,
    message,
    statusCode,
  }
}

// Add the missing apiResponse export
export function apiResponse(success, data = null, message = "", statusCode = 200) {
  return {
    success,
    message,
    data,
    statusCode,
  }
}
