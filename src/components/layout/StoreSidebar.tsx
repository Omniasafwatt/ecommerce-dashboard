import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Home,
  ShoppingCart,
  Package,
  MessageSquare,
  LogOut,
  Truck,
  Globe,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { selectNotifications } from '@/store/slices/notificationsSlice'
import { selectLanguage, setLanguage } from '@/store/slices/uiSlice'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  badgeCount?: number
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StoreNavItemProps {
  item: NavItem
}

function StoreNavItem({ item }: StoreNavItemProps) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end={item.path === '/store/dashboard'}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative group
        ${
          isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
        }
      `}
    >
      <div className="relative flex-shrink-0">
        <Icon size={20} />
        {item.badgeCount !== undefined && item.badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {item.badgeCount > 99 ? '99+' : item.badgeCount}
          </span>
        )}
      </div>
      <span className="flex-1">{item.label}</span>
      {item.badgeCount !== undefined && item.badgeCount > 0 && (
        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
          {item.badgeCount > 99 ? '99+' : item.badgeCount}
        </span>
      )}
    </NavLink>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface StoreSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function StoreSidebar({ mobileOpen, onMobileClose }: StoreSidebarProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const language = useAppSelector(selectLanguage)
  const { user, logout } = useAuth()

  // Count active/new orders from notifications
  const notifications = useAppSelector(selectNotifications)
  const newOrderCount = notifications.filter(
    (n) => n.type === 'new_order' && !n.isRead
  ).length

  const handleLanguageToggle = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en'
    dispatch(setLanguage(newLang))
    i18n.changeLanguage(newLang)
  }, [dispatch, language, i18n])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const NAV_ITEMS: NavItem[] = [
    { label: t('nav.home', 'Home'), path: '/store/dashboard', icon: Home },
    { label: t('nav.orders', 'Orders'), path: '/store/orders', icon: ShoppingCart, badgeCount: newOrderCount },
    { label: t('nav.inventory', 'Inventory'), path: '/store/inventory', icon: Package },
    { label: t('nav.chat', 'Chat'), path: '/store/chat', icon: MessageSquare },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Store name header */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-black text-lg leading-none">M</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate leading-tight">
              {user?.storeName ?? 'Mobile2000'}
            </p>
            <p className="text-xs text-slate-500 truncate">{t('store.storeManager')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <StoreNavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Driver info section */}
      <div className="px-4 py-4 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Truck size={14} className="text-slate-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {t('store.activeDrivers')}
            </p>
          </div>
          <p className="text-xl font-bold text-slate-800">3</p>
          <p className="text-xs text-slate-500">{t('store.onDutyNow')}</p>
        </div>

        {/* Language toggle */}
        <button
          onClick={handleLanguageToggle}
          title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-150"
        >
          <Globe size={16} className="flex-shrink-0" />
          <span className="font-medium">
            {language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>

        {/* User info + logout */}
        {user && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              title={t('auth.logout', 'Logout')}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed top-0 left-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64 lg:hidden
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
