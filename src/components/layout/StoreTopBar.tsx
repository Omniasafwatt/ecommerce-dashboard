import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, Bell, LogOut, ShoppingCart } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectNotifications } from '@/store/slices/notificationsSlice'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreTopBarProps {
  onMenuClick: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StoreTopBar({ onMenuClick }: StoreTopBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const notifications = useAppSelector(selectNotifications)

  // Count new orders requiring attention (unread new_order notifications)
  const newOrderCount = notifications.filter(
    (n) => n.type === 'new_order' && !n.isRead
  ).length

  // Count all unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login')
  }, [logout, navigate])

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Store name */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 truncate leading-tight">
          {user?.storeName ?? 'Store Dashboard'}
        </h1>
        <p className="text-xs text-slate-500 leading-tight hidden sm:block">
          Store Management Portal
        </p>
      </div>

      {/* New order alert */}
      {newOrderCount > 0 && (
        <button
          onClick={() => navigate('/store/orders')}
          className="
            hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
            bg-orange-50 border border-orange-200 text-orange-700
            hover:bg-orange-100 transition-colors text-sm font-medium
            animate-pulse
          "
          aria-label={`${newOrderCount} new orders`}
        >
          <ShoppingCart size={15} />
          <span>{newOrderCount} new {newOrderCount === 1 ? 'order' : 'orders'}</span>
        </button>
      )}

      {/* Notification bell */}
      <button
        onClick={() => navigate('/store/notifications')}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* User info */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div className="hidden sm:flex flex-col items-end min-w-0">
          <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px] leading-tight">
            {user?.name ?? 'Manager'}
          </span>
          <span className="text-xs text-slate-500 leading-tight">Store Manager</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            user?.name?.charAt(0) ?? 'S'
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title={t('auth.logout', 'Logout')}
          aria-label="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
