// services/api.ts
import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { getCookie } from '@/lib/cookies/cookies'
import { toastManager } from '@/utils/toast'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('access_token')
    if (token) {
      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {} as any
      }
      // Set Authorization header with Bearer token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // If FormData is being sent, let axios set Content-Type automatically (with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor to show toasts for POST and PUT requests
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response.config.method?.toLowerCase()
    const skipToast = (response.config as any).skipToast

    // Show success toast for POST and PUT requests (unless skipToast is set)
    if ((method === 'post' || method === 'put') && !skipToast) {
      const message =
        response.data?.message || response.data?.msg || 'Action completed successfully.'
      toastManager.success(message)
    }

    return response
  },
  (error: AxiosError) => {
    const method = error.config?.method?.toLowerCase()
    const skipToast = (error.config as any)?.skipToast

    // Show error toast for POST and PUT requests (unless skipToast is set)
    if ((method === 'post' || method === 'put') && !skipToast) {
      // Extract error message from various possible response structures
      let message = 'Something went wrong. Please try again.'
      
      if (error.response?.data) {
        const data = error.response.data as any
        const rawMessage =
          data?.message ||
          data?.msg ||
          data?.error ||
          (typeof data === 'string' ? data : null) ||
          (data?.errors && typeof data.errors === 'object' 
            ? Object.values(data.errors).flat().join(', ') 
            : null)
        
        // Filter out technical backend error messages and show user-friendly ones
        if (rawMessage) {
          // Check if it's a technical PHP/Laravel error
          if (
            rawMessage.includes('Argument #') ||
            rawMessage.includes('must be of type') ||
            rawMessage.includes('given') ||
            rawMessage.includes('BaseApiController') ||
            rawMessage.includes('EligibilityController')
          ) {
            // Show a user-friendly message for backend errors
            message = 'An error occurred while processing your request. Please try again or contact support.'
          } else {
            message = rawMessage
          }
        }
      } else if (error.message && !error.message.includes('Network Error')) {
        message = error.message
      }
      
      toastManager.error(message)
    }

    return Promise.reject(error)
  }
)

// Wrapper function to include token if it exists
export const apiRequest = async <T = unknown>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const token = getCookie('access_token')

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(config?.headers || {}),
  }

  const response = await api.request<T>({
    url,
    method,
    data,
    ...config,
    headers,
  })

  return response.data
}

export default api
