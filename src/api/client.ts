import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import { config } from '../config/env'

const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getAccessToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY)

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

// ─── Request interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }
    return reqConfig
  },
  (error) => Promise.reject(error)
)

// ─── Refresh logic ────────────────────────────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  failedQueue = []
}

const redirectToLogin = (): void => {
  clearTokens()
  // Avoid circular import by using window.location directly
  window.location.href = '/login'
}

// ─── Response interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (!error.response) {
      // Network error
      return Promise.reject(
        new Error('Network error. Please check your connection.')
      )
    }

    const { status } = error.response

    if (status === 403) {
      return Promise.reject(
        new Error('You do not have permission to perform this action.')
      )
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        redirectToLogin()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${config.apiBaseUrl}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const newAccessToken: string = data.data.accessToken
        const newRefreshToken: string =
          data.data.refreshToken ?? refreshToken

        setTokens(newAccessToken, newRefreshToken)
        apiClient.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        redirectToLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
