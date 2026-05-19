import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import StoreLayout from '@/components/layout/StoreLayout'
import DriverLayout from '@/components/layout/DriverLayout'

// ---------------------------------------------------------------------------
// Auth pages (eagerly loaded — tiny, always needed)
// ---------------------------------------------------------------------------
import Login from '@/pages/auth/Login'
import Unauthorized from '@/pages/auth/Unauthorized'
import Forbidden from '@/pages/auth/Forbidden'
import NotFound from '@/pages/auth/NotFound'

// ---------------------------------------------------------------------------
// Lazy page imports
// ---------------------------------------------------------------------------

// Admin — Overview
const AdminDashboard = React.lazy(() => import('@/pages/admin/overview/Dashboard'))

// Admin — Locations
const Governorates = React.lazy(() => import('@/pages/admin/locations/Governorates'))
const Areas = React.lazy(() => import('@/pages/admin/locations/Areas'))
const Stores = React.lazy(() => import('@/pages/admin/locations/Stores'))

// Admin — Users
const AdminUsers = React.lazy(() => import('@/pages/admin/users/Users'))
const AdminUserDetail = React.lazy(() => import('@/pages/admin/users/UserDetail'))
const Roles = React.lazy(() => import('@/pages/admin/users/Roles'))

// Admin — Catalog
const ProductList = React.lazy(() => import('@/pages/admin/catalog/products/ProductList'))
const ProductCreate = React.lazy(() => import('@/pages/admin/catalog/ProductCreate'))
const ProductDetail = React.lazy(() => import('@/pages/admin/catalog/ProductDetail'))
const Categories = React.lazy(() => import('@/pages/admin/catalog/Categories'))
const Brands = React.lazy(() => import('@/pages/admin/catalog/Brands'))
const Bundles = React.lazy(() => import('@/pages/admin/catalog/Bundles'))

// Admin — Operations
const Inventory = React.lazy(() => import('@/pages/admin/operations/Inventory'))
const Availability = React.lazy(() => import('@/pages/admin/operations/Availability'))
const Pricing = React.lazy(() => import('@/pages/admin/operations/Pricing'))
const Promotions = React.lazy(() => import('@/pages/admin/operations/Promotions'))
const DeliveryRules = React.lazy(() => import('@/pages/admin/operations/DeliveryRules'))
const PaymentMethods = React.lazy(() => import('@/pages/admin/operations/PaymentMethods'))

// Admin — Orders
const OrderList = React.lazy(() => import('@/pages/admin/orders/OrderList'))
const OrderDetail = React.lazy(() => import('@/pages/admin/orders/OrderDetail'))
const OrderReassignment = React.lazy(() => import('@/pages/admin/orders/OrderReassignment'))
const OrderCancellations = React.lazy(() => import('@/pages/admin/orders/OrderCancellations'))
const Refunds = React.lazy(() => import('@/pages/admin/orders/Refunds'))
const RefundDetail = React.lazy(() => import('@/pages/admin/orders/RefundDetail'))

// Admin — Finance & CRM
const Wallet = React.lazy(() => import('@/pages/admin/finance/Wallet'))
const ReturnList = React.lazy(() => import('@/pages/admin/returns/ReturnList'))
const ReturnDetail = React.lazy(() => import('@/pages/admin/crm/ReturnDetail'))
const Reviews = React.lazy(() => import('@/pages/admin/crm/Reviews'))

// Admin — Communication & Reporting
const AdminChat = React.lazy(() => import('@/pages/admin/communication/Chat'))
const Notifications = React.lazy(() => import('@/pages/admin/communication/Notifications'))
const Reports = React.lazy(() => import('@/pages/admin/reports/Reports'))
const AuditLogs = React.lazy(() => import('@/pages/admin/reports/AuditLogs'))

// Store pages
const StoreDashboard = React.lazy(() => import('@/pages/store/Dashboard'))
const StoreOrders = React.lazy(() => import('@/pages/store/Orders'))
const StoreOrderDetail = React.lazy(() => import('@/pages/store/OrderDetail'))
const StoreInventory = React.lazy(() => import('@/pages/store/Inventory'))
const StoreChat = React.lazy(() => import('@/pages/store/Chat'))

// Driver pages
const DriverHome = React.lazy(() => import('@/pages/driver/Home'))
const DriverDeliveries = React.lazy(() => import('@/pages/driver/Deliveries'))
const DriverDeliveryDetail = React.lazy(() => import('@/pages/driver/DeliveryDetail'))
const DriverChat = React.lazy(() => import('@/pages/driver/Chat'))
const DriverProfile = React.lazy(() => import('@/pages/driver/Profile'))

// ---------------------------------------------------------------------------
// Loading spinner — shown during code-split chunk loading
// ---------------------------------------------------------------------------
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading…</p>
      </div>
    </div>
  )
}

// Wrap a single lazy element in Suspense
function Lazy({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

// ---------------------------------------------------------------------------
// Admin roles shorthand
// ---------------------------------------------------------------------------
const ADMIN_ROLES = [
  'super_admin',
  'operations_admin',
  'catalog_manager',
  'finance',
  'support',
  'marketing',
] as const

// ---------------------------------------------------------------------------
// Router definition
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // ── Root redirect ─────────────────────────────────────────────────────────
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // ── Public auth routes ────────────────────────────────────────────────────
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/forbidden',
    element: <Forbidden />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },

  // ── Admin routes ──────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[...ADMIN_ROLES]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Overview
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Lazy component={AdminDashboard} /> },

      // Locations
      { path: 'locations/governorates', element: <Lazy component={Governorates} /> },
      { path: 'locations/areas', element: <Lazy component={Areas} /> },
      { path: 'locations/stores', element: <Lazy component={Stores} /> },

      // Users
      { path: 'users', element: <Lazy component={AdminUsers} /> },
      { path: 'users/:id', element: <Lazy component={AdminUserDetail} /> },
      { path: 'roles', element: <Lazy component={Roles} /> },

      // Catalog
      { path: 'catalog/products', element: <Lazy component={ProductList} /> },
      { path: 'catalog/products/new', element: <Lazy component={ProductCreate} /> },
      { path: 'catalog/products/:id', element: <Lazy component={ProductDetail} /> },
      { path: 'catalog/categories', element: <Lazy component={Categories} /> },
      { path: 'catalog/brands', element: <Lazy component={Brands} /> },
      { path: 'catalog/bundles', element: <Lazy component={Bundles} /> },

      // Operations
      { path: 'inventory', element: <Lazy component={Inventory} /> },
      { path: 'availability', element: <Lazy component={Availability} /> },
      { path: 'pricing', element: <Lazy component={Pricing} /> },
      { path: 'promotions', element: <Lazy component={Promotions} /> },
      { path: 'delivery-rules', element: <Lazy component={DeliveryRules} /> },
      { path: 'payment-methods', element: <Lazy component={PaymentMethods} /> },

      // Orders
      { path: 'orders', element: <Lazy component={OrderList} /> },
      { path: 'orders/reassignment', element: <Lazy component={OrderReassignment} /> },
      { path: 'orders/cancellations', element: <Lazy component={OrderCancellations} /> },
      { path: 'orders/refunds', element: <Lazy component={Refunds} /> },
      { path: 'orders/refunds/:id', element: <Lazy component={RefundDetail} /> },
      { path: 'orders/:id', element: <Lazy component={OrderDetail} /> },

      // Finance & CRM
      { path: 'wallet', element: <Lazy component={Wallet} /> },
      { path: 'returns', element: <Lazy component={ReturnList} /> },
      { path: 'returns/:id', element: <Lazy component={ReturnDetail} /> },
      { path: 'reviews', element: <Lazy component={Reviews} /> },

      // Communication & Reporting
      { path: 'chat', element: <Lazy component={AdminChat} /> },
      { path: 'notifications', element: <Lazy component={Notifications} /> },
      { path: 'reports', element: <Lazy component={Reports} /> },
      { path: 'audit-logs', element: <Lazy component={AuditLogs} /> },
    ],
  },

  // ── Store routes ──────────────────────────────────────────────────────────
  {
    path: '/store',
    element: (
      <ProtectedRoute allowedRoles={['store_manager']}>
        <StoreLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/store/dashboard" replace /> },
      { path: 'dashboard', element: <Lazy component={StoreDashboard} /> },
      { path: 'orders', element: <Lazy component={StoreOrders} /> },
      { path: 'orders/:id', element: <Lazy component={StoreOrderDetail} /> },
      { path: 'inventory', element: <Lazy component={StoreInventory} /> },
      { path: 'chat', element: <Lazy component={StoreChat} /> },
    ],
  },

  // ── Driver routes ─────────────────────────────────────────────────────────
  {
    path: '/driver',
    element: (
      <ProtectedRoute allowedRoles={['driver']}>
        <DriverLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/driver/home" replace /> },
      { path: 'home', element: <Lazy component={DriverHome} /> },
      { path: 'deliveries', element: <Lazy component={DriverDeliveries} /> },
      { path: 'deliveries/:id', element: <Lazy component={DriverDeliveryDetail} /> },
      { path: 'chat', element: <Lazy component={DriverChat} /> },
      { path: 'profile', element: <Lazy component={DriverProfile} /> },
    ],
  },

  // ── Catch-all 404 ─────────────────────────────────────────────────────────
  {
    path: '*',
    element: <NotFound />,
  },
])

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export default function AppRouter() {
  return <RouterProvider router={router} />
}
