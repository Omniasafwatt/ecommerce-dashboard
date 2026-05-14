import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  logout as logoutAction,
} from '../store/slices/authSlice'
import { clearTokens } from '../api/client'
import * as authApi from '../api/auth'
import type { UserRole } from '../types/auth'

/**
 * Central auth hook — provides user info and role/permission helpers.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const role = useAppSelector(selectUserRole)

  /**
   * Returns true if the current user has at least one of the specified roles.
   */
  const hasRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user]
  )

  /**
   * Returns true if the current user has a specific permission string.
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false
      // Super admins implicitly have all permissions
      if (user.role === 'super_admin') return true
      return user.permissions.includes(permission)
    },
    [user]
  )

  /**
   * Returns true if the current user has ALL of the specified permissions.
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return permissions.every((p) => user.permissions.includes(p))
    },
    [user]
  )

  /**
   * Returns true if the current user has ANY of the specified permissions.
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      return permissions.some((p) => user.permissions.includes(p))
    },
    [user]
  )

  /**
   * Log out: invalidate server session, clear local tokens, reset Redux state.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch {
      // Proceed with local logout even if the server call fails
    } finally {
      clearTokens()
      dispatch(logoutAction())
    }
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    role,
    hasRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    logout,
  }
}

export default useAuth
