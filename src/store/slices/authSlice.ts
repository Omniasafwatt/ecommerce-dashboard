import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser, AuthTokens } from '../../types/auth'
import type { RootState } from '../index'

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>
    ) => {
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading, setError, updateTokens } =
  authSlice.actions

// Selectors
export const selectUser = (state: RootState) => state.auth.user
export const selectTokens = (state: RootState) => state.auth.tokens
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectUserRole = (state: RootState) => state.auth.user?.role
export const selectHasPermission =
  (permission: string) => (state: RootState) =>
    state.auth.user?.permissions.includes(permission) ?? false

export default authSlice.reducer
