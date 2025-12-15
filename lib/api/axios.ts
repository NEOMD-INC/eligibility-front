// services/api.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getCookie } from '@/lib/cookies/cookies'

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
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Wrapper function to include token if it exists
export const apiRequest = async <T = any>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
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
