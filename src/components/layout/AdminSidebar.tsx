import { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Map,
  MapPin,
  Store,
  Users,
  Shield,
  Package,
  Grid,
  Tag,
  Layers,
  Warehouse,
  ToggleLeft,
  DollarSign,
  Gift,
  Truck,
  CreditCard,
  ShoppingCart,
  ArrowRightLeft,
  XCircle,
  RotateCcw,
  Wallet,
  RefreshCw,
  Star,
  MessageSquare,
  Bell,
  BarChart2,
  FileText,
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import {
  selectSidebarOpen,
  selectLanguage,
  setSidebarOpen,
  setLanguage,
} from '@/store/slices/uiSlice'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  labelKey: string
  path: string
  icon: React.ElementType
}

interface NavGroup {
  groupKey: string
  items: NavItem[]
}

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: 'sidebar.overview',
    items: [
      { labelKey: 'nav.dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    groupKey: 'sidebar.locations',
    items: [
      { labelKey: 'nav.governorates', path: '/admin/locations/governorates', icon: Map },
      { labelKey: 'nav.areas', path: '/admin/locations/areas', icon: MapPin },
      { labelKey: 'nav.stores', path: '/admin/locations/stores', icon: Store },
    ],
  },
  {
    groupKey: 'sidebar.usersRoles',
    items: [
      { labelKey: 'nav.users', path: '/admin/users', icon: Users },
      { labelKey: 'nav.roles', path: '/admin/roles', icon: Shield },
    ],
  },
  {
    groupKey: 'sidebar.catalog',
    items: [
      { labelKey: 'nav.products', path: '/admin/catalog/products', icon: Package },
      { labelKey: 'nav.categories', path: '/admin/catalog/categories', icon: Grid },
      { labelKey: 'nav.brands', path: '/admin/catalog/brands', icon: Tag },
      { labelKey: 'nav.bundles', path: '/admin/catalog/bundles', icon: Layers },
    ],
  },
  {
    groupKey: 'sidebar.operations',
    items: [
      { labelKey: 'nav.inventory', path: '/admin/inventory', icon: Warehouse },
      { labelKey: 'nav.availability', path: '/admin/availability', icon: ToggleLeft },
      { labelKey: 'nav.pricing', path: '/admin/pricing', icon: DollarSign },
      { labelKey: 'nav.promoCodes', path: '/admin/promotions', icon: Gift },
      { labelKey: 'nav.deliveryRules', path: '/admin/delivery-rules', icon: Truck },
      { labelKey: 'nav.paymentMethods', path: '/admin/payment-methods', icon: CreditCard },
    ],
  },
  {
    groupKey: 'sidebar.orders',
    items: [
      { labelKey: 'nav.allOrders', path: '/admin/orders', icon: ShoppingCart },
      { labelKey: 'nav.reassignment', path: '/admin/orders/reassignment', icon: ArrowRightLeft },
      { labelKey: 'nav.cancellations', path: '/admin/orders/cancellations', icon: XCircle },
      { labelKey: 'nav.refunds', path: '/admin/orders/refunds', icon: RotateCcw },
    ],
  },
  {
    groupKey: 'sidebar.finance',
    items: [
      { labelKey: 'nav.wallet', path: '/admin/wallet', icon: Wallet },
      { labelKey: 'nav.returns', path: '/admin/returns', icon: RefreshCw },
    ],
  },
  {
    groupKey: 'sidebar.support',
    items: [
      { labelKey: 'nav.reviews', path: '/admin/reviews', icon: Star },
      { labelKey: 'nav.chat', path: '/admin/chat', icon: MessageSquare },
      { labelKey: 'nav.notifications', path: '/admin/notifications', icon: Bell },
    ],
  },
  {
    groupKey: 'sidebar.analytics',
    items: [
      { labelKey: 'nav.reports', path: '/admin/reports', icon: BarChart2 },
      { labelKey: 'nav.auditLogs', path: '/admin/audit-logs', icon: FileText },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SidebarNavGroupProps {
  group: NavGroup
  collapsed: boolean
  defaultOpen?: boolean
}

function SidebarNavGroup({ group, collapsed, defaultOpen = true }: SidebarNavGroupProps) {
  const [open, setOpen] = useState(defaultOpen)
  const location = useLocation()
  const { t } = useTranslation()

  const isGroupActive = group.items.some((item) =>
    location.pathname.startsWith(item.path)
  )

  const toggleOpen = useCallback(() => {
    if (!collapsed) setOpen((prev) => !prev)
  }, [collapsed])

  return (
    <div className="mb-1">
      {/* Group header */}
      {!collapsed && (
        <button
          onClick={toggleOpen}
          className={`
            w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors
            ${isGroupActive ? 'text-sky-400' : 'text-sky-400/70 hover:text-sky-200'}
          `}
        >
          <span>{t(group.groupKey)}</span>
          <span className="transition-transform duration-200">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        </button>
      )}

      {/* Separator when collapsed */}
      {collapsed && (
        <div className="mx-3 my-2 border-t border-sky-800/50" />
      )}

      {/* Nav items */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          collapsed || open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {group.items.map((item) => (
          <SidebarNavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  )
}

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
}

function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const Icon = item.icon
  const { t } = useTranslation()
  const label = t(item.labelKey)

  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin/dashboard'}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative
        ${collapsed ? 'justify-center' : ''}
        ${
          isActive
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-sky-200 hover:bg-sky-800/60 hover:text-white'
        }
      `}
    >
      <Icon
        size={18}
        className="flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
      />
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div
          className="
            absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-md
            whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100
            transition-opacity duration-150 z-50 shadow-lg border border-slate-700
            rtl:left-auto rtl:right-full rtl:ml-0 rtl:mr-3
          "
        >
          {label}
        </div>
      )}
    </NavLink>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AdminSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const language = useAppSelector(selectLanguage)
  const { user, logout } = useAuth()

  const isRTL = language === 'ar'

  const handleCollapseToggle = useCallback(() => {
    dispatch(setSidebarOpen(!sidebarOpen))
  }, [dispatch, sidebarOpen])

  const handleLanguageToggle = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en'
    dispatch(setLanguage(newLang))
    i18n.changeLanguage(newLang)
  }, [dispatch, language, i18n])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  // Sidebar width classes
  const sidebarWidthClass = sidebarOpen ? 'w-64' : 'w-16'

  const sidebarContent = (
    <div
      className={`
        flex flex-col h-full bg-sky-950 text-white overflow-hidden
        transition-all duration-300 ease-in-out ${sidebarWidthClass}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-sky-900/60">
        <div className={`flex items-center gap-2 overflow-hidden ${!sidebarOpen ? 'justify-center w-full' : ''}`}>
          <div className={`font-bold text-xs px-2 py-1 rounded-md flex items-center justify-center flex-shrink-0 leading-tight ${sidebarOpen ? 'bg-white text-sky-500' : 'bg-sky-500 text-white'}`}>
            {sidebarOpen ? 'MOBILE' : 'M'}
          </div>
          {sidebarOpen && (
            <span className="font-bold text-white text-sm tracking-wide">
              2000
            </span>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        {sidebarOpen && (
          <button
            onClick={handleCollapseToggle}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-sky-300 hover:text-white hover:bg-sky-800 transition-colors flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {!sidebarOpen && (
        <button
          onClick={handleCollapseToggle}
          className="hidden lg:flex items-center justify-center w-full py-2 text-sky-300 hover:text-white hover:bg-sky-800 transition-colors"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* ── Nav groups (scrollable) ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-transparent">
        {NAV_GROUPS.map((group) => (
          <SidebarNavGroup
            key={group.groupKey}
            group={group}
            collapsed={!sidebarOpen}
            defaultOpen
          />
        ))}
      </nav>

      {/* ── Bottom section ── */}
      <div className="border-t border-sky-900/60 px-2 py-3 space-y-1">
        {/* Language toggle */}
        <button
          onClick={handleLanguageToggle}
          title={sidebarOpen ? undefined : language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className={`
            flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sky-200
            hover:bg-sky-800/60 hover:text-white transition-all duration-150
            ${!sidebarOpen ? 'justify-center' : ''}
          `}
        >
          <Globe size={16} className="flex-shrink-0" />
          {sidebarOpen && (
            <span className="font-medium">
              {language === 'en' ? 'English' : 'العربية'}
            </span>
          )}
        </button>

        {/* User info + logout */}
        {user && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white uppercase">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>

            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-sky-300/70 truncate capitalize">
                    {user.role.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 p-1.5 rounded-md text-sky-300 hover:text-red-400 hover:bg-sky-800 transition-colors"
                  title={t('auth.logout', 'Logout')}
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Logout when collapsed */}
        {!sidebarOpen && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-sky-300 hover:text-red-400 hover:bg-sky-800/60 transition-all"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 h-full z-30
          ${isRTL ? 'right-0' : 'left-0'}
          transition-all duration-300
        `}
        style={{ width: sidebarOpen ? '16rem' : '4rem' }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`
          fixed top-0 h-full z-50 lg:hidden w-64
          transition-transform duration-300 ease-in-out
          ${isRTL ? 'right-0' : 'left-0'}
          ${
            mobileOpen
              ? 'translate-x-0'
              : isRTL
              ? 'translate-x-full'
              : '-translate-x-full'
          }
        `}
      >
        <div className="flex flex-col h-full bg-sky-950 text-white w-64">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-3 py-4 border-b border-sky-900/60">
            <div className="flex items-center gap-2">
              <div className="bg-white text-sky-500 font-bold text-xs px-2 py-1 rounded-md flex items-center justify-center leading-tight">
                MOBILE
              </div>
              <span className="font-bold text-white text-sm tracking-wide">2000</span>
            </div>
            <button
              onClick={onMobileClose}
              className="p-1.5 rounded-md text-sky-300 hover:text-white hover:bg-sky-800 transition-colors"
              aria-label="Close sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {NAV_GROUPS.map((group) => (
              <SidebarNavGroup
                key={group.groupKey}
                group={group}
                collapsed={false}
                defaultOpen
              />
            ))}
          </nav>

          <div className="border-t border-sky-900/60 px-2 py-3 space-y-1">
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sky-200 hover:bg-sky-800/60 hover:text-white transition-all"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'English' : 'العربية'}</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-sky-300/70 truncate capitalize">
                    {user.role.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-sky-300 hover:text-red-400 hover:bg-sky-800 transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
