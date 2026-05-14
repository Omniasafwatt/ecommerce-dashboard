import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Globe,
  X,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import {
  selectLanguage,
  setLanguage,
} from '@/store/slices/uiSlice'
import {
  selectUnreadCount,
  selectNotifications,
  markAllAsRead,
} from '@/store/slices/notificationsSlice'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BreadcrumbSegment {
  label: string
  path: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  locations: 'Locations',
  governorates: 'Governorates',
  areas: 'Areas',
  stores: 'Stores',
  users: 'Users',
  roles: 'Roles',
  catalog: 'Catalog',
  products: 'Products',
  categories: 'Categories',
  brands: 'Brands',
  bundles: 'Bundles',
  inventory: 'Inventory',
  availability: 'Availability',
  pricing: 'Pricing',
  promotions: 'Promotions',
  'delivery-rules': 'Delivery Rules',
  'payment-methods': 'Payment Methods',
  orders: 'Orders',
  reassignment: 'Reassignment',
  cancellations: 'Cancellations',
  refunds: 'Refunds',
  wallet: 'Wallet',
  returns: 'Returns',
  reviews: 'Reviews',
  chat: 'Chat',
  notifications: 'Notifications',
  reports: 'Reports',
  'audit-logs': 'Audit Logs',
}

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: BreadcrumbSegment[] = []
  let cumulativePath = ''

  for (const segment of segments) {
    cumulativePath += `/${segment}`
    crumbs.push({
      label: ROUTE_LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      path: cumulativePath,
    })
  }

  return crumbs
}

// ─── Notification dropdown ────────────────────────────────────────────────────

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectNotifications)
  const recent = notifications.slice(0, 8)

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
        <button
          onClick={() => dispatch(markAllAsRead())}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
        {recent.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No notifications</p>
        ) : (
          recent.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !notif.isRead ? 'bg-indigo-50/40' : ''
              }`}
              onClick={onClose}
            >
              <p className={`text-sm font-medium text-slate-800 ${!notif.isRead ? 'font-semibold' : ''}`}>
                {notif.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100">
          <Link
            to="/admin/notifications"
            onClick={onClose}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── User dropdown ────────────────────────────────────────────────────────────

function UserDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    onClose()
    await logout()
    navigate('/login')
  }, [logout, navigate, onClose])

  return (
    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      {user && (
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      )}

      <div className="py-1">
        <Link
          to="/admin/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <User size={15} className="text-slate-400" />
          Profile
        </Link>
        <Link
          to="/admin/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Settings size={15} className="text-slate-400" />
          Settings
        </Link>
      </div>

      <div className="border-t border-slate-100 py-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AdminTopBarProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const language = useAppSelector(selectLanguage)
  const unreadCount = useAppSelector(selectUnreadCount)
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const breadcrumbs = buildBreadcrumbs(location.pathname)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLanguageToggle = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en'
    dispatch(setLanguage(newLang))
    i18n.changeLanguage(newLang)
  }, [dispatch, language, i18n])

  const isRTL = language === 'ar'

  return (
    <header
      className="
        sticky top-0 z-20 flex items-center gap-3 px-4 py-3
        bg-white border-b border-slate-200 shadow-sm
        transition-all duration-300
      "
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1 flex-1 min-w-0" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1
          return (
            <span key={crumb.path} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight
                  size={13}
                  className={`text-slate-400 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`}
                />
              )}
              {isLast ? (
                <span className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-sm text-slate-500 hover:text-slate-700 truncate max-w-[120px] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>

      {/* Spacer for mobile */}
      <div className="flex-1 sm:flex-none" />

      {/* Global search */}
      <div className="relative hidden md:block">
        <Search
          size={15}
          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
            isRTL ? 'right-3' : 'left-3'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('common.search', 'Search...')}
          className={`
            h-9 w-52 xl:w-64 bg-slate-100 border border-transparent rounded-lg text-sm text-slate-800
            placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white
            focus:ring-2 focus:ring-indigo-100 transition-all
            ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}
          `}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${
              isRTL ? 'left-2' : 'right-2'
            }`}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors text-sm font-medium"
          title="Switch language"
        >
          <Globe size={15} />
          <span className="text-xs font-semibold uppercase">{language}</span>
        </button>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications((v) => !v)
              setShowUserMenu(false)
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User avatar dropdown */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setShowUserMenu((v) => !v)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) ?? 'U'
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
              {user?.name ?? 'User'}
            </span>
          </button>

          {showUserMenu && <UserDropdown onClose={() => setShowUserMenu(false)} />}
        </div>
      </div>
    </header>
  )
}
