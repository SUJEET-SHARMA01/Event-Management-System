// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('firebaseToken') || localStorage.getItem('token')
}

// Get JWT token from localStorage
export const getJWTToken = () => {
  return localStorage.getItem('jwtToken')
}

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const jwtToken = getJWTToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(jwtToken && { 'X-JWT-Token': jwtToken }),
      ...options.headers,
    },
  }

  // Handle FormData (for file uploads)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type']
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// API methods
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

export default api
