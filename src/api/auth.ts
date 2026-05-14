import apiClient from './client'
import type { ApiResponse } from '../types/common'
import type { LoginRequest, LoginResponse, AuthUser } from '../types/auth'

// ─── MOCK ACCOUNTS FOR DEVELOPMENT ───────────────────────────────────────
const MOCK_ACCOUNTS = [
  // Super Admin
  { email: 'admin@store.com', password: 'admin123', name: 'Admin User', role: 'super_admin' as const },
  
  // Store Managers (لكل فرع)
  { email: 'ahmed@store.com', password: 'ahmed123', name: 'Ahmed Manager', role: 'store_manager' as const, storeId: '1', storeName: 'Salmiya Branch' },
  { email: 'fatima@store.com', password: 'fatima123', name: 'Fatima Manager', role: 'store_manager' as const, storeId: '2', storeName: 'Kuwait City Branch' },
  { email: 'layla@store.com', password: 'layla123', name: 'Layla Manager', role: 'store_manager' as const, storeId: '3', storeName: 'Farwaniya Branch' },
  { email: 'noor@store.com', password: 'noor123', name: 'Noor Manager', role: 'store_manager' as const, storeId: '4', storeName: 'Jahra Branch' },
  
  // Drivers
  { email: 'ali@store.com', password: 'ali123', name: 'Driver Ali', role: 'driver' as const },
  { email: 'mohammed@store.com', password: 'mohammed123', name: 'Driver Mohammed', role: 'driver' as const },
  
  // Admin roles
  { email: 'sara@store.com', password: 'sara123', name: 'Sara Support', role: 'support' as const },
  { email: 'finance@store.com', password: 'finance123', name: 'Finance Team', role: 'finance' as const },
  { email: 'catalog@store.com', password: 'catalog123', name: 'Catalog Admin', role: 'catalog_manager' as const },
  { email: 'marketing@store.com', password: 'marketing123', name: 'Marketing Team', role: 'marketing' as const },
]

// ─── MOCK LOGIN FUNCTION ──────────────────────────────────────────────────
const mockLogin = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  const account = MOCK_ACCOUNTS.find(acc => acc.email === email && acc.password === password)
  
  if (!account) {
    throw new Error('Invalid email or password')
  }

  const user: AuthUser = {
    id: Math.random().toString(36).substr(2, 9),
    name: account.name,
    email: account.email,
    role: account.role,
    storeId: (account as any).storeId,
    storeName: (account as any).storeName,
    permissions: ['read', 'write'], // Default permissions
  }

  const tokens = {
    accessToken: 'mock_' + Math.random().toString(36).substr(2, 20),
    refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 20),
    expiresIn: 3600,
  }

  return {
    success: true,
    message: 'Login successful',
    data: { user, tokens },
  }
}

/**
 * Log in with email + password.
 * Returns user data and access/refresh tokens.
 */
export const login = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    return await mockLogin(data.email, data.password)
  } catch (error: any) {
    throw new Error(error.message || 'Login failed')
  }
}

/**
 * Exchange a refresh token for a new access token.
 */
export const refreshToken = async (
  token: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >('/auth/refresh', { refreshToken: token })
  return response.data
}

/**
 * Invalidate the current session on the server.
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

/**
 * Request a password-reset email.
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { email })
}

/**
 * Reset password using the token from the reset email.
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await apiClient.post('/auth/reset-password', { token, newPassword })
}
