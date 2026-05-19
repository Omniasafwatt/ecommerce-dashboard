import { useCallback, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Package, MessageSquare, User, LogOut, Truck } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { selectUser, logout as logoutAction } from '@/store/slices/authSlice'
import { selectToasts, removeToast } from '@/store/slices/uiSlice'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { Toast } from '@/store/slices/uiSlice'

const TOAST_ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const TOAST_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.type]
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-xs w-full ${TOAST_STYLES[toast.type]}`}>
      <Icon size={16} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1"><p className="text-sm font-semibold">{toast.title}</p></div>
      <button onClick={() => onDismiss(toast.id)}><X size={14} /></button>
    </div>
  )
}

export default function DriverLayout() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const toasts = useAppSelector(selectToasts)

  const BOTTOM_NAV = [
    { label: t('nav.home'), path: '/driver/home', icon: Home },
    { label: t('nav.deliveries'), path: '/driver/deliveries', icon: Package },
    { label: t('nav.chat'), path: '/driver/chat', icon: MessageSquare },
    { label: t('nav.profile'), path: '/driver/profile', icon: User },
  ]

  const handleLogout = useCallback(() => {
    dispatch(logoutAction())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }, [dispatch, navigate])

  const dismiss = useCallback((id: string) => dispatch(removeToast(id)), [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800 leading-tight">{t('driver.appTitle')}</p>
            <p className="text-[11px] text-gray-500">{user?.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={14} />
          {t('auth.logout')}
        </button>
      </header>

      {/* Page content — leaves space for bottom nav */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex z-30 shadow-lg">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
                isActive ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'text-sky-600' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-sky-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs z-[9999] flex flex-col gap-2 px-4">
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
        </div>
      )}
    </div>
  )
}
