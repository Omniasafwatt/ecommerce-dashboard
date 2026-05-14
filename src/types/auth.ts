export type UserRole =
  | 'super_admin'
  | 'operations_admin'
  | 'catalog_manager'
  | 'store_manager'
  | 'driver'
  | 'finance'
  | 'support'
  | 'marketing'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  storeId?: string
  storeName?: string
  driverId?: string
  avatar?: string
  permissions: string[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface AuthState {
  user: AuthUser | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
