import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:'

// Attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = Cookies.get('refreshToken')
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        Cookies.set('accessToken', data.accessToken, { secure: isSecureContext, sameSite: 'lax' })
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        if (typeof window !== 'undefined') window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
