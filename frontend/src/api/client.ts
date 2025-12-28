import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 and 403 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on login/register page (let the component handle the error)
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register"
      
      if (!isAuthPage) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }
    
    // Handle 403 errors (suspended/inactive users)
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || "Access forbidden"
      // If user is suspended or inactive, log them out and redirect
      if (errorMessage.includes("suspended") || errorMessage.includes("pending approval")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`
        return Promise.reject(error)
      }
    }
    
    return Promise.reject(error)
  },
)

export default client
