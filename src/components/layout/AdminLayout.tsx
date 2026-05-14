import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store'
import {
  selectSidebarOpen,
  selectLanguage,
  selectToasts,
  removeToast,
} from '@/store/slices/uiSlice'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'
import type { Toast } from '@/store/slices/uiSlice'

// ─── Toast notification component ────────────────────────────────────────────

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const TOAST_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const TOAST_ICON_STYLES = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = TOAST_ICONS[toast.type]
  const duration = toast.duration ?? 4000

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(toast.id), duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, duration, onDismiss])

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        animate-in slide-in-from-right-4 fade-in duration-300
        ${TOAST_STYLES[toast.type]}
        max-w-sm w-full
      `}
      role="alert"
    >
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${TOAST_ICON_STYLES[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-xs mt-0.5 opacity-80 leading-snug">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function ToastContainer() {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector(selectToasts)

  const dismiss = useCallback(
    (id: string) => dispatch(removeToast(id)),
    [dispatch]
  )

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 rtl:right-auto rtl:left-5"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const language = useAppSelector(selectLanguage)
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isRTL = language === 'ar'

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleMobileClose = useCallback(() => setMobileMenuOpen(false), [])
  const handleMenuClick = useCallback(() => setMobileMenuOpen(true), [])

  // Determine content left/right margin based on sidebar state and RTL
  const contentMargin = sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
  const contentMarginRTL = sidebarOpen ? 'lg:mr-64' : 'lg:mr-16'

  return (
    <div
      className="min-h-screen bg-slate-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Main content area */}
      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300
          ${isRTL ? contentMarginRTL : contentMargin}
        `}
      >
        {/* Top bar */}
        <AdminTopBar
          onMenuClick={handleMenuClick}
          sidebarCollapsed={!sidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer (optional) */}
        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200">
          &copy; {new Date().getFullYear()} Mobile2000. All rights reserved.
        </footer>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}
