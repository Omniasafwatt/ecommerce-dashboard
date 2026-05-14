import { useState, useCallback, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  ShoppingCart,
  Package,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  X,
  Store,
  ChevronRight,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { selectUser, logout as logoutAction } from '@/store/slices/authSlice'
import { selectToasts, removeToast } from '@/store/slices/uiSlice'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import type { Toast } from '@/store/slices/uiSlice'

const NAV_ITEMS = [
  { label: 'Home', path: '/store/dashboard', icon: Home },
  { label: 'Orders', path: '/store/orders', icon: ShoppingCart },
  { label: 'Inventory', path: '/store/inventory', icon: Package },
  { label: 'Chat', path: '/store/chat', icon: MessageSquare },
]

const TOAST_ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const TOAST_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}
const TOAST_ICON_STYLES = {
  success: 'text-green-500', error: 'text-red-500', warning: 'text-amber-500', info: 'text-blue-500',
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.type]
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full ${TOAST_STYLES[toast.type]}`} role="alert">
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${TOAST_ICON_STYLES[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.message && <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="flex-shrink-0 p-0.5 rounded hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  )
}

export default function StoreLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector(selectUser)
  const toasts = useAppSelector(selectToasts)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = useCallback(() => {
    dispatch(logoutAction())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }, [dispatch, navigate])

  const dismiss = useCallback((id: string) => dispatch(removeToast(id)), [dispatch])

  const pageTitles: Record<string, string> = {
    '/store/dashboard': 'Dashboard',
    '/store/orders': 'Orders',
    '/store/inventory': 'Inventory',
    '/store/chat': 'Chat',
  }
  const currentTitle = pageTitles[location.pathname] || 'Store Dashboard'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed top-0 left-0 h-full z-30">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">{user?.storeName || 'Mobile2000'}</p>
              <p className="text-[10px] text-gray-500">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">{user?.storeName || 'Mobile2000'}</p>
                <p className="text-xs text-gray-500">{user?.name}</p>
              </div>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.path} to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`
                  }
                >
                  <item.icon size={18} />{item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-red-600">
                <LogOut size={18} />Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Store size={14} />
              <ChevronRight size={12} />
              <span className="font-semibold text-gray-800">{currentTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-700">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2">
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
        </div>
      )}
    </div>
  )
}
