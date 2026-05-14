import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice'
import type { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * ProtectedRoute
 *
 * 1. If the user is NOT authenticated  → redirect to /login (preserves intended URL in state)
 * 2. If allowedRoles is specified and the user's role is NOT included → redirect to /forbidden
 * 3. Otherwise renders children
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const location = useLocation()

  // Not logged in — send to login, preserve the attempted path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check — if allowedRoles is provided, the user's role must be in the list
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
